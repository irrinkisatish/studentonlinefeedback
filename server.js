const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const bcrypt  = require("bcrypt");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/imagesbvr',express.static('imagesbvr'));
app.use('/pic',express.static('pic'));
app.use('/alumni',express.static('alumni'));
app.use('/bvrlife',express.static('bvrlife'));
app.use('/primages',express.static('primages'));
app.use('/alumnitalks',express.static('alumnitalks'));
app.use('/eventposts',express.static('eventposts'));
app.use('/facultyimages',express.static('facultyimages'));
app.use('/studentimages',express.static('studentimages'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor',
  database: 'studentfeedback',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const studentstorage = multer.diskStorage({
  destination: 'C:/studentfeedback/public/studentimages',
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const studentupload = multer({ storage: studentstorage });

const facultystorage = multer.diskStorage({
  destination: 'C:/studentfeedback/public/facultyimages',
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const facultyupload = multer({ storage: facultystorage });




// Define the API endpoint for redirecting to studentlogin.html
app.get('/redirect-to-studentlogin', (req, res) => {
  console.log('Redirecting to studentlogin.html');
 
  res.redirect('/studentlogin.html');
});

app.get('/redirect-to-studentregister', (req, res) => {
  // Redirect to studentlogin.html
  res.redirect('/srform.html');
});

const authenticatestudentToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  console.log("Authorization Header:", authHeader);
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "SECRET_KEY", async (error, payLoad) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        console.log(payLoad);
        // Assuming payload contains studentgroup and studentyear
      const { id,studentbranch, studentyear } = payLoad;
        request.headers.id = id;
      request.headers.studentbranch = studentbranch;
      request.headers.studentyear = studentyear;
        next();
      }
    });
  }
};

const authenticatefacultyToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  console.log("Authorization Header:", authHeader);
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "SECRET_KEY", async (error, payLoad) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        console.log(payLoad);
        // Assuming payload contains studentgroup and studentyear
      const { id,facultybranch, facultyyear,faculty_subject } = payLoad;
        request.headers.id = id;
      request.headers.facultyBranch = facultybranch;
      request.headers.facultyYear = facultyyear;
      request.headers.facultySubject = faculty_subject;
        next();
      }
    });
  }
};
app.get('/facultynamesforfeedback', (req, res) => {
  const { course, year } = req.query;  // Get course and year from query params
 console.log(course)
  const sql = 'SELECT firstname,lastname FROM faculty WHERE FIND_IN_SET(?, teaching_group) AND FIND_IN_SET(?, teaching_year)';

  db.query(sql, [course, year], (err, result) => {
      if (err) throw err;
      console.log(result)
      res.json(result);  // Send result as JSON to the frontend
  });
});

app.get('/subjectsnamesforfeedback', (req, res) => {
  const { course, year,name } = req.query;  // Get course and year from query params
  const splitname = name.split(" ")
  console.log(splitname)
  console.log(course)
  const firstname  = splitname[0]
  const lastname = splitname[1]
  const sql = 'SELECT  teaching_subject FROM faculty WHERE FIND_IN_SET(?, teaching_group) AND FIND_IN_SET(?, teaching_year) AND firstname = ? AND lastname=?';

  db.query(sql, [course, year,firstname,lastname], (err, result) => {
      if (err) throw err;
      console.log(result)
      res.json(result);  // Send result as JSON to the frontend
  });
});

//--------------------------------------student-page-api----------------------------------------------------------------------
app.post('/srform', studentupload.single('file'), async (req, res) => {
  const { firstName, lastName, email, password, phone, dob, gender, address, studentyear, branch, group, rollnumber } = req.body;
  const imageUrl = '/studentimages/' + req.file.filename;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const checkRollNumberInHallTicketSql = `SELECT 1 FROM hallticketnumbers WHERE hall_ticket_number = ?`;
  const checkRollNumberInStudentSql = `SELECT 1 FROM student WHERE rollnumber = ?`;

  db.query(checkRollNumberInHallTicketSql, [rollnumber], (err, result) => {
    if (err) {
      console.error('Error checking hall ticket number:', err);
      return res.status(500).json({ success: false, message: 'Error checking hall ticket number.' });
    }

    if (result.length === 0) {
      return res.status(400).json({ success: false, message: 'Rollnumber not found in hall ticket numbers.' });
    }

    db.query(checkRollNumberInStudentSql, [rollnumber], (err, result) => {
      if (err) {
        console.error('Error checking student roll number:', err);
        return res.status(500).json({ success: false, message: 'Error checking student roll number.' });
      }

      if (result.length > 0) {
        return res.status(400).json({ success: false, message: 'Rollnumber already exists in student table.' });
      }

      const insertStudentSql = `INSERT INTO student (fname, lname, email, password, phone, dob, gender, address, branch, group_name, rollnumber, image_url, year, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
      const values = [firstName, lastName, email, hashedPassword, phone, dob, gender, address, branch, group, rollnumber, imageUrl, studentyear];

      db.query(insertStudentSql, values, (err, result) => {
        if (err) {
          console.error('Error inserting data into database:', err);
          return res.status(500).json({ success: false, message: 'Error inserting data into database.' });
        } else {
          res.json({ success: true, message: 'Registration successful!' });
        }
      });
    });
  });
});

app.post('/updatestudentdata', studentupload.single('file'), async(req, res) => {
  const { studentId, firstName, lastName, email, phone, dob, gender, address, studentyear, branch, group, rollnumber } = req.body;
  
  const imageUrl = '/studentimages/'+req.file.filename;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const updateSql = `UPDATE student 
                     SET fname=?, lname=?, email=?, password=?, phone=?, dob=?, gender=?, address=?, branch=?, group_name=?, rollnumber=?, image_url=?, year=?
                     WHERE student_id=?`;
  const values = [firstName, lastName, email, hashedPassword, phone, dob, gender, address, branch, group, rollnumber, imageUrl, studentyear, studentId];

  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error('Error updating data into database:', err);
      res.status(500).send('Error updating data into database.');
    } else {
      
      res.redirect(`/studentprofile.html?id=${studentId}&msg=updatesuccess`);
    }
  });
});

app.post('/studentloginform', async (req, res) => {
  const { Email, password } = req.body;
 

  const selectUserQuery = 'SELECT * FROM student WHERE email = ?';
  db.query(selectUserQuery, [Email], async (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database.');
      return;
    }

    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid Email' });
      
    }

    const dbUser = result[0];
  
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {email:Email,id:dbUser.student_id,studentbranch:dbUser.group_name,studentyear:dbUser.year};
      const jwtToken = jwt.sign(payload,"SECRET_KEY");
      // Set the JWT token in the response header
      res.set('Authorization', `Bearer ${jwtToken}`);
      res.status(200).json({ token: jwtToken});
    } else {
      return res.status(400).json({ error: 'Invalid Password' });
    }
  });
});

        

app.get('/alumnitalks',authenticatestudentToken , (req, res) => {
  // Fetch alumnitalks data from the database
  const query = 'SELECT * FROM alumnitalk ORDER BY id DESC LIMIT 4';
  db.query(query, (err, alumnitalksData) => {
    if (err) {
      console.error('Error fetching alumnitalks data:', err);
      res.status(500).json({ error: 'Error fetching alumnitalks data' });
    } else {
      // Send the alumnitalksData as JSON
      res.json(alumnitalksData);
    }
  });
});

app.get('/collegevents',authenticatestudentToken , (req, res) => {
  // Fetch alumnitalks data from the database
  const query = 'SELECT * FROM eventposts ORDER BY eventid DESC LIMIT 4';
  db.query(query, (err, eventsData) => {
    if (err) {
      console.error('Error fetching alumnitalks data:', err);
      res.status(500).json({ error: 'Error fetching alumnitalks data' });
    } else {
      // Send the alumnitalksData as JSON
      res.json(eventsData);
    }
  });
});

// Endpoint to get faculty data based on student year and branch
app.get('/api/getFacultyData',authenticatestudentToken , (req, res) => {
  // Get the parameters from the query string
  const studentyear = req.headers['studentyear'];
  const studentbranch = req.headers['studentbranch'];
  console.log(studentyear);
  console.log(studentbranch);
  // Build the SQL query to fetch specific faculty details based on parameters
  const sql = 'SELECT * FROM faculty WHERE teaching_year LIKE ? AND teaching_group LIKE ?';
  const values = [`%${studentyear}%`, `%${studentbranch}%`];

  // Execute the query with parameters
  db.query(sql, values, (err, result) => {
   
    if (err) {
      console.error('Error fetching faculty data:', err);
      res.status(500).send('Error fetching faculty data');
    } else {
      res.json(result);
    }
  });
});

app.post('/studentfeedback',authenticatestudentToken ,(req, res) => {
  console.log('Received POST request at /studentfeedback');
  console.log('Request body:', req.body);
  const studentId = req.headers['id'];
  const studentyear = req.headers['studentyear'];
  const studentbranch = req.headers['studentbranch'];
  // Extract data from req.body
  const { groupname, facultyId, syllabus_covered, teacheruses_tools, prepapreforclasses, teaching_approrach, identifytoovercome,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess, feedback } = req.body;
  console.log(req.body);
  // Insert data into the database
  const sql = `INSERT INTO feedback (student_id, faculty_id, feedback_text, subjectName, syllabus_covered, teacheruses_tools, prepapreforclasses, identifytoovercome, teaching_approrach,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess) VALUES (?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [studentId, facultyId, feedback, groupname, syllabus_covered, teacheruses_tools, prepapreforclasses, identifytoovercome, teaching_approrach,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting feedback data into database:', err);
      res.status(500).send('Error inserting feedback data into database.');
    } else {
      console.log('Feedback data inserted successfully.');
      res.status(200).send("seccess")
    }
  });
});

app.post('/studentsearchfeedback',authenticatestudentToken ,(req, res) => {
  console.log('Received POST request at /studentfeedback');
  console.log('Request body:', req.body);
  const studentId = req.headers['id'];
  const studentyear = req.headers['studentyear'];
  const studentbranch = req.headers['studentbranch'];
  // Extract data from req.body
  const { groupname, facultyId, syllabus_covered, teacheruses_tools, prepapreforclasses, teaching_approrach, identifytoovercome,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess, feedback } = req.body;
  console.log(req.body);
  // Insert data into the database
  const sql = `INSERT INTO feedback (student_id, faculty_id, feedback_text, subjectName, syllabus_covered, teacheruses_tools, prepapreforclasses, identifytoovercome, teaching_approrach,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess) VALUES (?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [studentId, facultyId, feedback, groupname, syllabus_covered, teacheruses_tools, prepapreforclasses, identifytoovercome, teaching_approrach,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting feedback data into database:', err);
      res.status(500).send('Error inserting feedback data into database.');
    } else {
      console.log('Feedback data inserted successfully.');
      res.status(200).send("success")
    }
  });
});

// Route to handle the search request
app.get('/searchrequest',authenticatestudentToken , async (req, res) => {
  const { firstname } = req.query;


          const sql = 'SELECT * FROM faculty WHERE firstname = ? OR lastname = ?';
          const values = [firstname, firstname];
    
          db.query(sql, values, (err, result) => {
            if (err) {
              console.error('Error fetching faculty data:', err);
              res.status(500).send('Error fetching faculty data');
            } else {
              res.json(result);
            }
          });
});


// Route to handle the search request
app.get('/studentgoprofile',authenticatestudentToken , async (req, res) => {
  const studentId = req.headers['id'];
  console.log(studentId);
  res.json({ studentId });
});
// Assuming you have an endpoint to fetch student profile data and feedback
app.get('/studentProfileData', (req, res) => {
  const studentId = req.query.id; // Assuming 'id' is the query parameter name
console.log(studentId);
  // Query to fetch student profile data
  db.query(`
  SELECT 
  s.*, 
  f.*,
  fac.firstname,fac.lastname, 
  f.id AS feedbackId
FROM 
  student s
LEFT JOIN 
  feedback f ON s.student_id = f.student_id
LEFT JOIN 
  faculty fac ON fac.id = f.faculty_id
WHERE 
  s.student_id = ?
  ORDER BY f.id DESC;


  `, [studentId], (error, studentResults) => {
    if (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ error: 'Error fetching student data.' });
    } else {
      console.log(studentResults);
      res.json(studentResults);
    }
  });
});


// Route to handle form submission and update faculty feedback
app.post('/updatefacultyfeedback', (req, res) => {
  const { feedback_id,studentid, syllabus_covered, teacheruses_tools, prepapreforclasses, teaching_approrach, identifytoovercome,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess, feedback } = req.body;

  const sql = 'UPDATE feedback SET feedback_text = ?, syllabus_covered = ?, teacheruses_tools = ?, prepapreforclasses = ?, identifytoovercome = ?, teaching_approrach = ?,teachercommunicate=?,teacherillustrate=?,teacherencourage=?,teacherperdiscess=?,teacherfairneess=? WHERE id = ?';
  const values = [feedback, syllabus_covered, teacheruses_tools, prepapreforclasses, identifytoovercome, teaching_approrach,teachercommunicate,teacherillustrate,teacherencourage,teacherperdiscess,teacherfairneess, feedback_id];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error updating feedback:', err);
          res.status(500).send('Error updating feedback');
      } else {
          console.log('Feedback updated successfully');
          // Redirect to studentprofile.html after successful update
          res.redirect('/studentprofile.html?id=' + studentid);
      }
  });
});


app.get('/studentlogout',authenticatestudentToken , (req, res) => {

  res.status(200).json({ message: 'Logout successful' });
 
 
});

//indexpage api
// Define the API endpoint for redirecting to facultylogin.html
app.get('/redirect-to-facultylogin', (req, res) => {
  console.log('Redirecting to facultylogin.html');
 
  res.redirect('/facultylogin.html');
});



//faculty-page-api--------------------------------------------------------------------------------------------------------------
app.get('/branches', (req, res) => {
  db.query('SELECT * FROM branches', (error, results, fields) => {
      if (error) {
          console.error('Error fetching branches:', error);
          res.status(500).json({ message: 'Error fetching branches' });
          return;
      }
      res.json(results);
  });
});


// Route to fetch groups by branch id
app.get('/groups/:branchName', (req, res) => {
  const branchName = req.params.branchName;
  db.query(`
      SELECT gd.name 
      FROM group_details gd
      JOIN branches b ON gd.branch_id = b.id
      WHERE b.name = ?`, [branchName], (error, results) => {
      if (error) {
          console.error('Error fetching groups:', error);
          res.status(500).json({ message: 'Error fetching groups' });
          return;
      }
      res.json(results);
  });
});



app.get('/registersubjects/:groupName', (req, res) => {
  const groupName = req.params.groupName;
  console.log(groupName)
  db.query(`
      SELECT s.name, s.id,s.group_id
      FROM subjects s
      JOIN group_details gd ON s.group_id = gd.id
      WHERE gd.name = ?`, [groupName], (error, results) => {
      if (error) {
          console.error('Error fetching subjects:', error);
          res.status(500).json({ message: 'Error fetching subjects' });
          return;
      }
      console.log(results);
      res.json(results);
  });
});

app.post('/facultylogin', async (req, res) => {
  const { Email, password } = req.body;
 

  const selectUserQuery = 'SELECT * FROM faculty WHERE faculty_email = ?';
  db.query(selectUserQuery, [Email], async (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database.');
      return;
    }

    if (result.length === 0) {
      return res.status(400).json({ error: 'Invalid Email' });
    }

    const dbUser = result[0];
    
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {email:Email,id:dbUser.id,facultybranch:dbUser.teaching_group,faculty_subject:dbUser.teaching_subject,facultyyear:dbUser.teaching_year};
      const jwtToken = jwt.sign(payload,"SECRET_KEY");
      // Set the JWT token in the response header
      res.set('Authorization', `Bearer ${jwtToken}`);
      res.status(200).json({ token: jwtToken});
    } else {
      return res.status(400).json({ error: 'Invalid Password' });
    }
  });
});

app.post('/registerfaculty', facultyupload.single('file'), async(req, res) => {
  const { firstName, lastName, email, password, phone, dob, gender, address, teaching_year, selected_group, selected_subject, selected_branch } = req.body;
  const imageUrl = '/facultyimages/'+req.file.filename;
  const teachingSubject = Array.isArray(selected_subject) ? selected_subject.join(', ') : selected_subject;
const teachingGroup = Array.isArray(selected_group) ? selected_group.join(', ') : selected_group;
const teachingBranch = Array.isArray(selected_branch) ? selected_branch.join(', ') : selected_branch;
const teachingYear = Array.isArray(teaching_year) ? teaching_year.join(', ') : teaching_year;
const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const sql = "INSERT INTO faculty (firstname, lastname, faculty_email, password, phone, dob, gender, address, teaching_year, teaching_group, teaching_subject, faculty_imageurl, teaching_branch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, email, hashedPassword, phone, dob, gender, address, teachingYear, teachingGroup, teachingSubject, imageUrl, teachingBranch], (err, result) => {
      if (err) {
          console.error('Error inserting data into database:', err);
          res.status(500).json({ error: 'Error inserting data into database' });
      } else {
          console.log('Data inserted successfully');
          res.redirect('/facultylogin.html?msg=registersuccess');
      }
  });
});





// API endpoint for fetching feedback details
app.get('/api/facultyfeedback', authenticatefacultyToken ,(req, res) => {
  const facultyId = req.headers['id']; // assuming the facultyId is passed as a query parameter
 
  const query = `
    SELECT *, AVG((teaching_approrach + syllabus_covered + teacheruses_tools + identifytoovercome + prepapreforclasses + teachercommunicate + teacherillustrate + teacherencourage + teacherperdiscess + teacherfairneess) / 10) AS ATA,
    (SELECT AVG((teaching_approrach + syllabus_covered + teacheruses_tools + identifytoovercome + prepapreforclasses + teachercommunicate + teacherillustrate + teacherencourage + teacherperdiscess + teacherfairneess) / 10) AS AverageOverall
    FROM feedback WHERE faculty_id = ? GROUP BY faculty_id) AS OverallPerformance
    FROM feedback fb JOIN student f ON fb.student_id = f.student_id WHERE fb.faculty_id = ? GROUP BY fb.id ORDER BY fb.id DESC;
  `;

  db.query(query, [facultyId, facultyId], (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).send('Error fetching data');
    } else {
      if (results.length === 0) {
        console.log('No data found for the given criteria.');
        res.status(404).send('No data found');
      } else {
        
        const data = results.map(result => ({
          Branch_name: result.branch,
          Teaching_Approach: result.teaching_approrach,
          identifytoovercome: result.identifytoovercome,
          prepapreforclasses: result.prepapreforclasses,
          teacheruses_tools: result.teacheruses_tools,
          syllabus_covered: result.syllabus_covered,
          ATA: result.ATA,
          OverallPerformance: result.OverallPerformance,
          feedbacktext: result.feedback_text,
          group_name: result.group_name,
          student_year: result.year,
          datetime: result.posted_date,
          subjectName: result.subjectName
        }));

        res.json(data);
      }
    }
  });
});

// API endpoint for fetching feedback details
app.post('/api/searchfacultyfeedback', authenticatefacultyToken ,(req, res) => {
  
  const facultyId = req.headers['id']; // assuming the facultyId is passed as a query parameter
 
  const studentYear = req.body.studentyear
  const studentsubject = req.body.studentsubject
  const studentclass = req.body.studentclass
 console.log(studentYear);
 console.log(studentclass);
 console.log(studentsubject);
  const query = `
  SELECT 
    s.*, 
    fb.*, 
    fac.*, 
    fb.id AS feedbackId,
    AVG((fb.teaching_approrach + fb.syllabus_covered + fb.teacheruses_tools + fb.identifytoovercome + fb.prepapreforclasses + fb.teachercommunicate + fb.teacherillustrate + fb.teacherencourage + fb.teacherperdiscess + fb.teacherfairneess) / 10) AS ATA,
    (
        SELECT AVG((ffb.teaching_approrach + ffb.syllabus_covered + ffb.teacheruses_tools + ffb.identifytoovercome + ffb.prepapreforclasses + ffb.teachercommunicate + ffb.teacherillustrate + ffb.teacherencourage + ffb.teacherperdiscess + ffb.teacherfairneess) / 10)
        FROM feedback ffb
        WHERE ffb.faculty_id = fb.faculty_id AND ffb.subjectName = fb.subjectName
        GROUP BY ffb.faculty_id, ffb.subjectName
    ) AS OverallPerformance
FROM 
    feedback fb
JOIN 
    student s ON fb.student_id = s.student_id
JOIN 
    faculty fac ON fb.faculty_id = fac.id
WHERE 
    fb.faculty_id = ? AND 
    fb.subjectName = ?  AND 
    s.year = ? AND 
    s.group_name = ?
GROUP BY 
    fb.id
    ORDER BY fb.id DESC;


  `;

  db.query(query, [facultyId, studentsubject, studentYear, studentclass], (error, results) => {
    if (error) {
      console.error('Error executing SQL query:', error);
      res.status(500).send('Error fetching data');
    } else {
      if (results.length === 0) {
        console.log('No data found for the given criteria.');
        res.status(404).send('No data found');
      } else {
        const data = results.map(result => ({
          Branch_name: result.branch,
          Teaching_Approach: result.teaching_approrach,
          identifytoovercome: result.identifytoovercome,
          prepapreforclasses: result.prepapreforclasses,
          teacheruses_tools: result.teacheruses_tools,
          syllabus_covered: result.syllabus_covered,
          ATA: result.ATA,
          OverallPerformance: result.OverallPerformance,
          feedbacktext: result.feedback_text,
          student_year: result.year,
          group_name: result.group_name,
          datetime: result.posted_date,
          subjectName: result.subjectName
        }));

        res.json(data);
      }
    }
  });
});

app.get('/api/facultydetailsget',authenticatefacultyToken,(req,res)=>{
  const facultyYear = req.headers['facultyYear'];
  const facultyid = req.headers['id'];
  const facultyBranch = req.headers['facultyBranch'];
  const facultySubject = req.headers['facultySubject'];
  res.json({ facultyid,facultyBranch, facultySubject, facultyYear });
});

app.post('/api/students', authenticatefacultyToken ,(req, res) => {
  
  const {studentyear,studentgroup}= req.body;
 
  // Define the SQL query
  const query = `
  SELECT *
  FROM student
  WHERE year =? AND group_name =?
  ORDER BY rollnumber ASC;
  `;

  // Execute the SQL query with parameters using db connection
  db.query(query,  [studentyear, studentgroup], (error, results, fields) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json(results);
  });
});
app.get('/faculty/searchstudents', (req, res) => {
  const searchText = req.query.firstname;
  const searchYear = req.query.studentyear;
  const searchBranch = req.query.studentbranch;
  console.log(searchBranch);

  if (searchText && searchText.trim() !== '') {
      const query = `SELECT * FROM student WHERE FIND_IN_SET(year, ?) AND FIND_IN_SET(group_name, ?) AND (lname=? OR fname=?)`;
      db.query(query, [searchYear, searchBranch, searchText, searchText], (err, results) => {
          if (err) {
              console.error('Error executing MySQL query:', err);
              res.status(500).send('Error fetching search results.');
              return;
          }
          res.json(results);
      });
  } else {
      res.status(400).send('Please enter a search query.');
  }
});
app.get('/fetch_attendance_students', async (req, res) => {
  try {
    const selectedYear = req.query.year;
    const selectedGroup = req.query.group;

    db.query(
      'SELECT * FROM student WHERE year = ? AND group_name = ? ORDER BY rollnumber ASC;',
      [selectedYear, selectedGroup],
      (err, results, fields) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        let studentsHTML = '<table border="1"><tr><th>Select</th><th>Full Name</th><th>Roll Number</th></tr>';
        results.forEach((row) => {
          studentsHTML += `
  <tr>
    <td>
      <input type="checkbox" id="student${row.student_id}" name="students[]" value="${row.student_id}">
    </td>
    <td>
      <label for="student${row.student_id}">${row.fname} ${row.lname}</label>
    </td>
    <td>
      <label for="student${row.student_id}">${row.rollnumber}</label>
    </td>
  </tr>


          `;
        });
studentsHTML.innerHTML += '</table>';
        res.send(studentsHTML);
      }
    );
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Define the API endpoint for attendance submission
app.post('/submitAttendance', async (req, res) => {
  try {
    const { facultyid,teachingsubject,teachingbranch,teachingyears, subject_name: facultysubject, students, date } = req.body;
   

    
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).send('Invalid students data');
    }

   
    for (const studentId of students) {
     
      db.query(
        'INSERT INTO attendance (student_id, faculty_id, date, subject_name) VALUES (?, ?, ?, ?)',
        [studentId, facultyid, date, facultysubject],
        (err, results, fields) => {
          if (err) {
            console.error('Error executing query:', err);
         
            return res.status(500).send('Internal Server Error');
          }
      
        }
      );
      sendAttendanceEmailtoStudent(studentId,facultyid,facultysubject,res);
    }

    res.redirect(`/faculty.html?msg=attendance submit success`);
  } catch (error) {
    console.error('Error handling attendance submission:', error);
    // If an error occurs during try block execution, send an internal server error response
    res.status(500).send('Internal Server Error');
  }
});


// API Endpoint for fetching attendance data
app.post('/fetchAttendanceData', (req, res) => {
    const { attfacultyid, studentyear, studentclass,studentsubject, todate, fromdate } = req.body;
    console.log(req.body);
  const sql = `SELECT a.student_id, s.fname, s.lname, a.subject_name,s.rollnumber, 
  COUNT(*) AS attendance_count, 
  ROUND((COUNT(*) / (DATEDIFF(?, ?) + 1)) * 100) AS average_attendance 
FROM attendance a 
JOIN student s ON a.student_id = s.student_id 
WHERE a.faculty_id = ? AND s.year = ? AND s.group_name = ? AND a.subject_name = ?
 AND a.date BETWEEN ? AND ? 
GROUP BY a.student_id, s.fname, s.lname, a.subject_name ORDER BY s.rollnumber ASC;
`;

  db.query(sql, [fromdate, todate, attfacultyid, studentyear, studentclass,studentsubject, todate, fromdate], (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
      } else {
          let htmlResponse = '<h2 style="text-align: center;" class="mb-3 tables-headings">Attendance Counts</h2> <div class="d-flex flex-row justify-content-end mb-3"><button id="downloadattendancedetails" class="btn btn-primary">Download to Excel</button></div> <table border="1" id="attendancedata">';
          htmlResponse += '<tr><th>Register No</th><th>First Name</th><th>Last Name</th><th>Subject</th><th>Attendance Count</th><th>Average Attendance</th></tr>';

          results.forEach((row) => {
              htmlResponse += `<tr><td>${row.rollnumber}</td><td>${row.fname}</td><td>${row.lname}</td><td>${row.subject_name}</td><td>${row.attendance_count}</td><td>${row.average_attendance}%</td></tr>`;
          });

          htmlResponse += '</table>';
          res.send(htmlResponse);
      }
  });
});


// Route to handle the search request
app.get('/facultyprofile',authenticatefacultyToken , async (req, res) => {
  const facultyId = req.headers['id'];

  res.json({ facultyId });
});

app.get('/facultyProfile/:id', (req, res) => {
  const facultyId = req.params.id; // Assuming 'id' is the query parameter name

  // Query to fetch student profile data
  db.query(`
  SELECT * FROM faculty WHERE id = ?;
  `, [facultyId], (error, facultyResults) => {
    if (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ error: 'Error fetching student data.' });
    } else {
      console.log(facultyResults);
      res.json(facultyResults[0]);
    }
  });
});

app.post('/updatesfacultydata', facultyupload.single('file'), async(req, res) => {
  const { facultyId, firstName, lastName, email, password, phone, dob, gender, address, teaching_year, selected_branch, selected_group, selected_subject } = req.body;
  const teachingSubject = Array.isArray(selected_subject) ? selected_subject.join(', ') : selected_subject;
  const teachingGroup = Array.isArray(selected_group) ? selected_group.join(', ') : selected_group;
  const teachingBranch = Array.isArray(selected_branch) ? selected_branch.join(', ') : selected_branch;
  const teachingYear = Array.isArray(teaching_year) ? teaching_year.join(', ') : teaching_year;
  const imageUrl = '/facultyimages/'+req.file.filename;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateSql = `UPDATE faculty SET firstname = ?, lastname = ?, faculty_email = ?, password = ?, phone = ?, dob = ?, gender = ?, address = ?, teaching_year = ?, teaching_group = ?, teaching_subject = ?, faculty_imageurl = ?, teaching_branch = ? WHERE id = ?`;
  const values = [firstName, lastName, email, hashedPassword, phone, dob, gender, address,teachingYear, teachingGroup, teachingSubject, imageUrl,  teachingBranch, facultyId];

  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error('Error updating data into database:', err);
      res.status(500).send('Error updating data into database.');
    } else {
      
      res.redirect(`/facultyprofile.html?id=${facultyId}&msg=updatesuccess`);
    }
  });
});

app.get('/facultycollegevents',authenticatefacultyToken,(req, res) => {
  const query = 'SELECT * FROM eventposts ORDER BY eventid DESC LIMIT 4';
  db.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Error fetching college events' });
      } else {
          res.json(results);
      }
  });
});

app.get('/facultyalumnitalks',authenticatefacultyToken, (req, res) => {
  const query = 'SELECT * FROM alumnitalk ORDER BY id DESC LIMIT 4';
  db.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Error fetching alumni talks' });
      } else {
          res.json(results);
      }
  });
});

app.get('/facultylogout',authenticatefacultyToken , (req, res) => {

  res.status(200).json({ message: 'Logout successful' });
 
 
});

app.post('/submitAlumniFeedback', async (req, res) => {
  const { name, year, statusaddress, number, email, course, suggestion_text, rating,
    relevance_of_curriculum, infrastructure_facilities, guest_lecturers_arrangement,
    student_teacher_interaction, cooperation_from_staff, teaching_faculties_availability,
    overall_facilities_satisfaction, contribution_to_college } = req.body;

  try {
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        res.status(500).send('Error starting transaction.');
        return;
      }

      // Insert data into the alumni table
      const insertAlumniSql = `INSERT INTO alumni (name_of_alumnus, year, address, contact_number, email, course,
        suggestion_text, rating, relevance_of_curriculum_answer_id, infrastructure_facilities_answer_id,
        guest_lecturers_arrangement_answer_id, student_teacher_interaction_answer_id, cooperation_from_staff_answer_id,
        teaching_faculties_availability_answer_id, overall_facilities_satisfaction_answer_id, contribution_to_college_answer_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const alumniValues = [
        name, year, statusaddress, number, email, course, suggestion_text, rating,
        null, null, null, null, null, null, null, null
      ];

      db.query(insertAlumniSql, alumniValues, (err, insertAlumniResult) => {
        if (err) {
          console.error('Error inserting alumni data:', err);
          db.rollback(() => {
            console.error('Transaction rolled back.');
            res.status(500).send('Error submitting alumni feedback.');
          });
          return;
        }

        const alumniId = insertAlumniResult.insertId;

        // Insert data into the alumnifeedbackanswers table and get generated answer_ids
        const insertFeedbackSql = `INSERT INTO alumnifeedbackanswers (answer_text, question_id) VALUES (?, ?)`;
        const insertFeedbackValues = [
          relevance_of_curriculum, infrastructure_facilities, guest_lecturers_arrangement,
          student_teacher_interaction, cooperation_from_staff, teaching_faculties_availability,
          overall_facilities_satisfaction, contribution_to_college
        ];
        const questionIds = [1, 2, 3, 4, 5, 6, 7, 8]; // Adjust question IDs as per your database schema

        // Array to store the generated answer_ids
        const answerIds = [];

        // Loop through each feedback value and insert into alumnifeedbackanswers table
        insertFeedbackValues.forEach((answerText, index) => {
          const questionId = questionIds[index];
          db.query(insertFeedbackSql, [answerText, questionId], (err, insertFeedbackResult) => {
            if (err) {
              console.error('Error inserting feedback data:', err);
              db.rollback(() => {
                console.error('Transaction rolled back.');
                res.status(500).send('Error submitting alumni feedback.');
              });
              return;
            }

            // Store the generated answer_id
            answerIds.push(insertFeedbackResult.insertId);

            // Check if all feedback values have been processed
            if (answerIds.length === insertFeedbackValues.length) {
              // Update the alumni table with relevant answer_ids
              const updateAlumniSql = `
                UPDATE alumni 
                SET 
                  relevance_of_curriculum_answer_id = ?, 
                  infrastructure_facilities_answer_id = ?, 
                  guest_lecturers_arrangement_answer_id = ?, 
                  student_teacher_interaction_answer_id = ?, 
                  cooperation_from_staff_answer_id = ?, 
                  teaching_faculties_availability_answer_id = ?, 
                  overall_facilities_satisfaction_answer_id = ?, 
                  contribution_to_college_answer_id = ? 
                WHERE alumni_id = ?
              `;
              const updateValues = [
                answerIds[0], answerIds[1], answerIds[2], answerIds[3],
                answerIds[4], answerIds[5], answerIds[6], answerIds[7], alumniId
              ];

              db.query(updateAlumniSql, updateValues, (err) => {
                if (err) {
                  console.error('Error updating alumni data:', err);
                  db.rollback(() => {
                    console.error('Transaction rolled back.');
                    res.status(500).send('Error submitting alumni feedback.');
                  });
                  return;
                }

                // Commit the transaction
                db.commit((err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    res.status(500).send('Error submitting alumni feedback.');
                    return;
                  }

                  console.log('Transaction committed successfully.');
                  res.redirect(`/alumni.html?msg=updatesuccess`);
                });
              });
            }
          });
        });
      });
    });
  } catch (error) {
    console.error('Error submitting alumni feedback:', error);
    res.status(500).send('Error submitting alumni feedback.');
  }
});



//-------------------admin-page-apis-----------------------------------------------------------
// Get all groups
// Get columns and data from a table
app.get('/columns/:tableName', (req, res) => {
  const { tableName } = req.params;
  const queryColumns = `SHOW COLUMNS FROM \`${tableName}\``;
  const queryData = `SELECT * FROM \`${tableName}\``;

  db.query(queryColumns, (error, columnsResults) => {
      if (error) {
          console.error('Error fetching columns:', error);
          res.status(500).json({ message: 'Error fetching columns' });
          return;
      }

      const columns = columnsResults.map(column => column.Field);

      db.query(queryData, (error, dataResults) => {
          if (error) {
              console.error('Error fetching table data:', error);
              res.status(500).json({ message: 'Error fetching table data' });
              return;
          }

          res.json({ columns, rows: dataResults });
      });
  });
});

// Get groups
app.get('/formgroups', (req, res) => {
  db.query('SELECT * FROM `group_details`', (error, results) => {
      if (error) {
          console.error('Error fetching groups:', error);
          res.status(500).json({ message: 'Error fetching groups' });
          return;
      }
      res.json(results);
  });
});

// Get subjects by group ID
app.get('/subjects/:groupId', (req, res) => {
  const { groupId } = req.params;
  db.query('SELECT * FROM `subjects` WHERE `group_id` = ?', [groupId], (error, results) => {
      if (error) {
          console.error('Error fetching subjects:', error);
          res.status(500).json({ message: 'Error fetching subjects' });
          return;
      }
      res.json(results);
  });
});

// Add a row to a table
app.post('/add-row/:tableName', (req, res) => {
  const { tableName } = req.params;
  const data = req.body;

  const columns = Object.keys(data).join(', ');
  const values = Object.values(data).map(value => `'${value}'`).join(', ');

  const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values})`;
  db.query(query, (error, results) => {
      if (error) {
          console.error('Error adding row:', error);
          res.status(500).json({ message: 'Error adding row' });
          return;
      }
      res.json({ message: 'Row added successfully' });
  });
});

// Delete a row from a table
app.post('/delete-row/:tableName', (req, res) => {
  const { tableName } = req.params;
  const { id } = req.body;

  const query = `DELETE FROM \`${tableName}\` WHERE id = ?`;
  db.query(query, [id], (error, results) => {
      if (error) {
          console.error('Error deleting row:', error);
          res.status(500).json({ message: 'Error deleting row' });
          return;
      }
      res.json({ message: 'Row deleted successfully' });
  });
});

app.get('/adminapi/students', (req, res) => {
  const query = 'SELECT * FROM student ORDER BY student_id DESC;';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const modifiedResults = results.map(person => {
      const { password, ...personWithoutPassword } = person;
      return personWithoutPassword;
  });

  res.json(modifiedResults);
  });
});

// DELETE endpoint to delete a student record
app.delete('/apidelete/students/:id', (req, res) => {
  const studentId = req.params.id;
  
  // Disable foreign key checks
  db.query('SET FOREIGN_KEY_CHECKS=0', (disableError) => {
    if (disableError) {
      console.error('Error disabling foreign key checks:', disableError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Delete the student record
    const deleteQuery = 'DELETE FROM student WHERE student_id = ?';
    db.query(deleteQuery, [studentId], (deleteError, results) => {
      if (deleteError) {
        console.error('Error deleting student record:', deleteError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Student record not found' });
        return;
      }

      // Enable foreign key checks again
      db.query('SET FOREIGN_KEY_CHECKS=1', (enableError) => {
        if (enableError) {
          console.error('Error enabling foreign key checks:', enableError);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Respond with 204 No Content for successful deletion
        res.status(204).send();
      });
    });
  });
});

app.get('/apiadmin/faculty', (req, res) => {
  const query = 'SELECT * FROM faculty';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const modifiedResults = results.map(person => {
      const {password, ...personWithoutPassword } = person;
      return personWithoutPassword;
  });

  res.json(modifiedResults);
  });
});


// DELETE endpoint to delete a faculty record
app.delete('/apidelete/faculty/:id', (req, res) => {
  const facultyId = req.params.id;
  
  // Disable foreign key checks
  db.query('SET FOREIGN_KEY_CHECKS=0', (disableError) => {
    if (disableError) {
      console.error('Error disabling foreign key checks:', disableError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Delete the faculty record
    const deleteQuery = 'DELETE FROM faculty WHERE id = ?';
    db.query(deleteQuery, [facultyId], (deleteError, results) => {
      if (deleteError) {
        console.error('Error deleting faculty record:', deleteError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Faculty record not found' });
        return;
      }

      // Enable foreign key checks again
      db.query('SET FOREIGN_KEY_CHECKS=1', (enableError) => {
        if (enableError) {
          console.error('Error enabling foreign key checks:', enableError);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Respond with 204 No Content for successful deletion
        res.status(204).send();
      });
    });
  });
});

// Endpoint to fetch feedback data
app.get('/apiadmin/feedback', (req, res) => {
  const query = `
  SELECT 
  s.*, t.*, f.*,
  f.student_id,
  f.faculty_id,
  f.subjectName,
  f.teaching_approrach,
  f.syllabus_covered,
  f.teacheruses_tools,
  f.identifytoovercome,
  f.prepapreforclasses,
  f.teachercommunicate,
  f.teacherillustrate,
  f.teacherencourage,
  f.teacherperdiscess,
  f.teacherfairneess,
  (f.teaching_approrach + f.syllabus_covered + f.teacheruses_tools + f.identifytoovercome + f.prepapreforclasses + f.teachercommunicate + f.teacherillustrate + f.teacherencourage + f.teacherperdiscess + f.teacherfairneess) / 10 AS ATA,
  avg_feedback.AverageOverall
FROM feedback f 
JOIN (
  SELECT 
      faculty_id,
      subjectName,
      AVG((teaching_approrach + syllabus_covered + teacheruses_tools + identifytoovercome + prepapreforclasses + teachercommunicate + teacherillustrate + teacherencourage + teacherperdiscess + teacherfairneess) / 10) AS AverageOverall
  FROM feedback 
  GROUP BY faculty_id, subjectName
) avg_feedback ON f.faculty_id = avg_feedback.faculty_id AND f.subjectName = avg_feedback.subjectName
JOIN student s ON f.student_id = s.student_id 
JOIN faculty t ON f.faculty_id = t.id
ORDER BY f.id DESC;

`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching feedback data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


// API endpoint to search students based on course and year
app.get('/search-students', (req, res) => {
  const { course, year } = req.query;
  
    const query =`select * from student where group_name='${course}' and year='${year}' order by rollnumber ASC;`
    console.log(query);
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching feedback data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    const modifiedResults = results.map(person => {
      const {password, ...personWithoutPassword } = person;
      return personWithoutPassword;
  });
  res.json(modifiedResults);
  });
  
});


// Endpoint to fetch feedback data
app.get('/api/faculty-feedback', (req, res) => {
  const selectedCourse = req.query.course;
  const selectedYear = req.query.year;
  const selectsub = req.query.subject;
  const selectfname = req.query.name
  const splittedname = selectfname.split(" ")
  const firstname = splittedname[0];
  const lastname  = splittedname[1];
  const query = `
  SELECT 
  s.rollnumber,
  t.firstname,t.lastname,
  f.feedback_text,
  f.subjectName,
  f.teaching_approrach,
  f.syllabus_covered,
  f.teacheruses_tools,
  f.identifytoovercome,
  f.prepapreforclasses,
  f.teachercommunicate,
  f.teacherillustrate,
  f.teacherencourage,
  f.teacherperdiscess,
  f.teacherfairneess,
  (f.teaching_approrach + f.syllabus_covered + f.teacheruses_tools + f.identifytoovercome + f.prepapreforclasses + f.teachercommunicate + f.teacherillustrate + f.teacherencourage + f.teacherperdiscess + f.teacherfairneess) / 10 AS ATA,
  avg_feedback.AverageOverall
FROM feedback f 
JOIN (
  SELECT 
      faculty_id,
      subjectName,
      AVG((teaching_approrach + syllabus_covered + teacheruses_tools + identifytoovercome + prepapreforclasses + teachercommunicate + teacherillustrate + teacherencourage + teacherperdiscess + teacherfairneess) / 10) AS AverageOverall
  FROM feedback 
  GROUP BY faculty_id, subjectName
) avg_feedback ON f.faculty_id = avg_feedback.faculty_id AND f.subjectName = avg_feedback.subjectName
JOIN student s ON f.student_id = s.student_id 
JOIN faculty t ON f.faculty_id = t.id
WHERE 
  FIND_IN_SET('${selectedCourse}', t.teaching_group) > 0 
  AND FIND_IN_SET('${selectedYear}', t.teaching_year) > 0
  AND f.subjectName  = '${selectsub}'
  AND t.firstname = '${firstname}' AND t.lastname='${lastname}'

ORDER BY s.rollnumber ASC;

  ;


`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching feedback data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
   console.log(results)
    res.json(results);
    
  });
});
app.get('/api/alumni-feedback', (req, res) => {
  const selectedCourse = req.query.course;

  const query = `
      SELECT 
          a.alumni_id, 
          a.name_of_alumnus,
          a.year, 
          a.rating,                  
          a.address, 
          a.contact_number, 
          a.email, 
          a.course, 
          a.suggestion_text, 
          q_relevance.question_text AS relevance_question, 
          ra_relevance.answer_text AS relevance_of_curriculum, 
          q_infrastructure.question_text AS infrastructure_question, 
          ia_infrastructure.answer_text AS infrastructure_facilities,
          q_guest.question_text AS guest_lecturers_arrangement_question,
  ga_guest.answer_text AS guest_lecturers_arrangement,
  q_student_teacher.question_text AS student_teacher_interaction_question,
  sti_student_teacher.answer_text AS student_teacher_interaction,
  q_staff_cooperation.question_text AS cooperation_from_staff_question,
  cf_staff_cooperation.answer_text AS cooperation_from_staff,
  q_faculties_availability.question_text AS teaching_faculties_availability_question,
  tfa_faculties_availability.answer_text AS teaching_faculties_availability,
  q_facilities_satisfaction.question_text AS overall_facilities_satisfaction_question,
  ofs_facilities_satisfaction.answer_text AS overall_facilities_satisfaction,
  q_contribution.question_text AS contribution_to_college_question,
  cc_contribution.answer_text AS contribution_to_college,
          (SELECT SUM(rating) / COUNT(alumni_id) FROM alumni WHERE course = ?) AS average_rating
      FROM alumni a
      LEFT JOIN alumnifeedbackanswers ra_relevance ON a.relevance_of_curriculum_answer_id = ra_relevance.answer_id
      LEFT JOIN alumnifeedbackquestion q_relevance ON ra_relevance.question_id = q_relevance.question_id
      LEFT JOIN alumnifeedbackanswers ia_infrastructure ON a.infrastructure_facilities_answer_id = ia_infrastructure.answer_id
      LEFT JOIN alumnifeedbackquestion q_infrastructure ON ia_infrastructure.question_id = q_infrastructure.question_id
      
LEFT JOIN
  alumnifeedbackanswers ga_guest ON a.guest_lecturers_arrangement_answer_id = ga_guest.answer_id
LEFT JOIN
  alumnifeedbackquestion q_guest ON ga_guest.question_id = q_guest.question_id
LEFT JOIN
  alumnifeedbackanswers sti_student_teacher ON a.student_teacher_interaction_answer_id = sti_student_teacher.answer_id
LEFT JOIN
  alumnifeedbackquestion q_student_teacher ON sti_student_teacher.question_id = q_student_teacher.question_id
LEFT JOIN
  alumnifeedbackanswers cf_staff_cooperation ON a.cooperation_from_staff_answer_id = cf_staff_cooperation.answer_id
LEFT JOIN
  alumnifeedbackquestion q_staff_cooperation ON cf_staff_cooperation.question_id = q_staff_cooperation.question_id
LEFT JOIN
  alumnifeedbackanswers tfa_faculties_availability ON a.teaching_faculties_availability_answer_id = tfa_faculties_availability.answer_id
LEFT JOIN
  alumnifeedbackquestion q_faculties_availability ON tfa_faculties_availability.question_id = q_faculties_availability.question_id
LEFT JOIN
  alumnifeedbackanswers ofs_facilities_satisfaction ON a.overall_facilities_satisfaction_answer_id = ofs_facilities_satisfaction.answer_id
LEFT JOIN
  alumnifeedbackquestion q_facilities_satisfaction ON ofs_facilities_satisfaction.question_id = q_facilities_satisfaction.question_id
LEFT JOIN
  alumnifeedbackanswers cc_contribution ON a.contribution_to_college_answer_id = cc_contribution.answer_id
LEFT JOIN
  alumnifeedbackquestion q_contribution ON cc_contribution.question_id = q_contribution.question_id
      WHERE a.course = ?
      ORDER BY a.alumni_id DESC;
  `;

  db.query(query, [selectedCourse, selectedCourse], (error, results) => {
      if (error) {
          console.error('Error fetching alumni feedback:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      res.json(results);
  });
});

// API endpoint to fetch alumni feedback
app.get('/api/alumniFeedback', (req, res) => {
  const query = `
  SELECT
  a.alumni_id,
  a.name_of_alumnus,
  a.year,
  a.rating,
  a.address,
  a.contact_number,
  a.email,
  a.course,
  a.suggestion_text,
  q_relevance.question_text AS relevance_question,
  ra_relevance.answer_text AS relevance_of_curriculum,
  q_infrastructure.question_text AS infrastructure_question,
  ia_infrastructure.answer_text AS infrastructure_facilities,
  q_guest.question_text AS guest_lecturers_arrangement_question,
  ga_guest.answer_text AS guest_lecturers_arrangement,
  q_student_teacher.question_text AS student_teacher_interaction_question,
  sti_student_teacher.answer_text AS student_teacher_interaction,
  q_staff_cooperation.question_text AS cooperation_from_staff_question,
  cf_staff_cooperation.answer_text AS cooperation_from_staff,
  q_faculties_availability.question_text AS teaching_faculties_availability_question,
  tfa_faculties_availability.answer_text AS teaching_faculties_availability,
  q_facilities_satisfaction.question_text AS overall_facilities_satisfaction_question,
  ofs_facilities_satisfaction.answer_text AS overall_facilities_satisfaction,
  q_contribution.question_text AS contribution_to_college_question,
  cc_contribution.answer_text AS contribution_to_college,
  (SELECT SUM(rating) / COUNT(alumni_id) FROM alumni) AS average_rating
FROM
  alumni a
LEFT JOIN
  alumnifeedbackanswers ra_relevance ON a.relevance_of_curriculum_answer_id = ra_relevance.answer_id
LEFT JOIN
  alumnifeedbackquestion q_relevance ON ra_relevance.question_id = q_relevance.question_id
LEFT JOIN
  alumnifeedbackanswers ia_infrastructure ON a.infrastructure_facilities_answer_id = ia_infrastructure.answer_id
LEFT JOIN
  alumnifeedbackquestion q_infrastructure ON ia_infrastructure.question_id = q_infrastructure.question_id
LEFT JOIN
  alumnifeedbackanswers ga_guest ON a.guest_lecturers_arrangement_answer_id = ga_guest.answer_id
LEFT JOIN
  alumnifeedbackquestion q_guest ON ga_guest.question_id = q_guest.question_id
LEFT JOIN
  alumnifeedbackanswers sti_student_teacher ON a.student_teacher_interaction_answer_id = sti_student_teacher.answer_id
LEFT JOIN
  alumnifeedbackquestion q_student_teacher ON sti_student_teacher.question_id = q_student_teacher.question_id
LEFT JOIN
  alumnifeedbackanswers cf_staff_cooperation ON a.cooperation_from_staff_answer_id = cf_staff_cooperation.answer_id
LEFT JOIN
  alumnifeedbackquestion q_staff_cooperation ON cf_staff_cooperation.question_id = q_staff_cooperation.question_id
LEFT JOIN
  alumnifeedbackanswers tfa_faculties_availability ON a.teaching_faculties_availability_answer_id = tfa_faculties_availability.answer_id
LEFT JOIN
  alumnifeedbackquestion q_faculties_availability ON tfa_faculties_availability.question_id = q_faculties_availability.question_id
LEFT JOIN
  alumnifeedbackanswers ofs_facilities_satisfaction ON a.overall_facilities_satisfaction_answer_id = ofs_facilities_satisfaction.answer_id
LEFT JOIN
  alumnifeedbackquestion q_facilities_satisfaction ON ofs_facilities_satisfaction.question_id = q_facilities_satisfaction.question_id
LEFT JOIN
  alumnifeedbackanswers cc_contribution ON a.contribution_to_college_answer_id = cc_contribution.answer_id
LEFT JOIN
  alumnifeedbackquestion q_contribution ON cc_contribution.question_id = q_contribution.question_id
  ORDER BY
  a.alumni_id DESC;
`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching alumni feedback:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

const alumnistorage = multer.diskStorage({
  destination: 'C:/studentfeedback/public/alumnitalks',
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const alumniupload = multer({ storage: alumnistorage });
app.post('/alumnitalkserverpost', alumniupload.fields([{ name: 'alumniimage', maxCount: 1 }, { name: 'alumnivideo', maxCount: 1 }]), (req, res) => {
  const { alumniname, alumnitopic, alumniabout } = req.body;
  const alumniimage = '/alumnitalks/'+req.files['alumniimage'][0].filename;
  const alumnivideo = '/alumnitalks/'+req.files['alumnivideo'][0].filename;

  const sql = 'INSERT INTO alumnitalk (alumniname, alumnitopic, alumniabout, alumniimage, alumnivideo) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [alumniname, alumnitopic, alumniabout, alumniimage, alumnivideo], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).send('Error inserting data into database.');
    } else {
      console.log('Data inserted into database successfully.');
      res.redirect('admin.html');
    }
  });
  
});

const eventstorage = multer.diskStorage({
  destination: 'C:/studentfeedback/public/eventposts',
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const eventupload = multer({ storage: eventstorage });
app.post('/eventpostserver', eventupload.fields([{ name: 'eventimage', maxCount: 1 }, { name: 'eventvideo', maxCount: 1 }]), (req, res) => {
  const { eventname, eventtopic, eventabout } = req.body;
  const alumniimage = '/eventposts/'+req.files['eventimage'][0].filename;
  const alumnivideo = '/eventposts/'+req.files['eventvideo'][0].filename;

  const sql = 'INSERT INTO eventposts (eventname, eventtopic, eventabout, eventimage, eventvideo) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [eventname, eventtopic, eventabout, alumniimage, alumnivideo], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).send('Error inserting data into database.');
    } else {
      console.log('Data inserted into database successfully.');
      res.redirect('admin.html');
    }
  });
  
});


app.get('/alumnitalkes', (req, res) => {
  const query = 'SELECT * FROM alumnitalk ORDER BY id DESC';
  console.log("hi");
  db.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Error fetching alumni talks' });
      } else {
        console.log(results);
          res.json(results);
      }
  });
});


app.get('/collegeeventes',(req, res) => {
  const query = 'SELECT * FROM eventposts ORDER BY eventid DESC';
  db.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Error fetching college events' });
      } else {
          res.json(results);
      }
  });
});

app.get('/alumnialumnitalkes', (req, res) => {
  const query = 'SELECT * FROM alumnitalk ORDER BY id DESC LIMIT 4';
  console.log("hi");
  db.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Error fetching alumni talks' });
      } else {
        console.log(results);
          res.json(results);
      }
  });
});


app.get('/alumnicollegeeventes',(req, res) => {
  const query = 'SELECT * FROM eventposts ORDER BY eventid DESC LIMIT 4';
  db.query(query, (error, results) => {
      if (error) {
          res.status(500).json({ error: 'Error fetching college events' });
      } else {
          res.json(results);
      }
  });
});
// Express route for logging out
app.get('/adminlogout', (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
});
app.post('/loginadmin', async (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM admin WHERE username = ? AND password = ?';
  const values = [username, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database.');
    } else {
      if (result.length > 0) {
        console.log(result);
      
        res.redirect(`/admin.html`);
        
      } else {
        res.redirect('/adminlogin.html?error=Invalid User');
      }
    }
  });
});

// API endpoint to fetch alumni feedback
app.get('/api/indedoverallfacFeedback', (req, res) => {
  const query = `
 SELECT 
    AVG(syllabus_covered) AS avg_syllabus_covered,
    AVG(teacheruses_tools) AS avg_teacheruses_tools,
    AVG(prepapreforclasses) AS avg_prepapreforclasses,
    AVG(identifytoovercome) AS avg_identifytoovercome,
    AVG(teaching_approrach) AS avg_teaching_approrach,
    AVG(teachercommunicate) AS avg_teachercommunicate,
    AVG(teacherillustrate) AS avg_teacherillustrate,
    AVG(teacherencourage) AS avg_teacherencourage,
    AVG(teacherperdiscess) AS avg_teacherperdiscess,
    AVG(teacherfairneess) AS avg_teacherfairneess,
    AVG((syllabus_covered + teacheruses_tools + prepapreforclasses + identifytoovercome + teaching_approrach + teachercommunicate + teacherillustrate + teacherencourage + teacherperdiscess + teacherfairneess) / 10) AS overall_average
FROM feedback;

`;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching alumni feedback:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

const nm = require('nodemailer');
const fs = require('fs');
let savedOTPS = {

};
const bannerPath = path.join(__dirname, 'public', 'imagesbvr', '017.jpg');
    
// Read the image file and convert it to Base64
const bannerBase64 = fs.readFileSync(bannerPath, 'base64');
var transporter = nm.createTransport(
    {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'studentonlinefeedbackbvrc@gmail.com',
            pass: 'uzmy qciu fnbu gxsn'
        }
    }
);
app.post('/sendotp', (req, res) => {
    let email = req.body.email;
    const sql = 'SELECT * FROM student WHERE email = ?';
  const values = [email];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database.');
    } else {
      if (result.length > 0) {
        let digits = '0123456789';
        let limit = 4;
        let otp = ''
        for (i = 0; i < limit; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
    
        }
        var options = {
            from: 'studentonlinefeedbackbvrc@gmail.com',
            to: `${email}`,
            subject: "Reset Password OTP",
            html: `<img src="cid:unique@banner.image" alt="Banner Image" width="1080px"/>
            <p>Enter the otp: ${otp} to verify your email address</p>
            `,
            attachments: [{
              filename: 'banner.jpg',
              path: bannerPath,
              cid: 'unique@banner.image' // Same CID as in the HTML img src
          }]
    
        };
        transporter.sendMail(
            options, function (error, info) {
                if (error) {
                    console.log(error);
                    res.status(500).send("couldn't send")
                }
                else {
                    savedOTPS[email] = otp;
                    setTimeout(
                        () => {
                            delete savedOTPS.email
                        }, 60000
                    )
                    res.send("sent otp")
                }
    
            }
        )
        
        
      } else {
        console.log("not");
        res.status(500).send("couldn't send")
      }
    }
  });
   
})

app.post('/verify', (req, res) => {
    let otprecived = req.body.otp;
    let email = req.body.email;
    if (savedOTPS[email] == otprecived) {
        res.send("Verfied");
    }
    else {
        res.status(500).send("Invalid OTP")
    }
})


app.post('/sendfacultyotp', (req, res) => {
  let email = req.body.email;
  const sql = 'SELECT * FROM faculty WHERE faculty_email = ?';
const values = [email];

db.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Error querying database.');
  } else {
    if (result.length > 0) {
      let digits = '0123456789';
      let limit = 4;
      let otp = ''
      for (i = 0; i < limit; i++) {
          otp += digits[Math.floor(Math.random() * 10)];
  
      }
      var options = {
          from: 'studentonlinefeedbackbvrc@gmail.com',
          to: `${email}`,
          subject: "Reset Password OTP",
          html: `<img src="cid:unique@banner.image" alt="Banner Image" width="1080px"/>
          <p>Enter the otp: ${otp} to verify your email address</p>
          `,
          attachments: [{
            filename: 'banner.jpg',
            path: bannerPath,
            cid: 'unique@banner.image' // Same CID as in the HTML img src
        }]
  
      };
      transporter.sendMail(
          options, function (error, info) {
              if (error) {
                  console.log(error);
                  res.status(500).send("couldn't send")
              }
              else {
                  savedOTPS[email] = otp;
                  setTimeout(
                      () => {
                          delete savedOTPS.email
                      }, 60000
                  )
                  res.send("sent otp")
              }
  
          }
      )
      
      
    } else {
    
      res.status(500).send("couldn't send")
    }
  }
});
 
})


app.post("/resetstudentpassword", async(req,res)=>{
  const email = req.body.Email;
  const password  = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateSql = `UPDATE student SET password = ?  WHERE email = ?`;
  const values = [hashedPassword, email];

  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error('Error updating data into database:', err);
      res.status(500).send('Error updating data into database.');
    } else {
      
      res.json({ success: true, message: 'Password changed successfully' });
    }
  });
  
})


app.post("/resetfacultypassword", async(req,res)=>{
  const email = req.body.Email;
  const password  = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateSql = `UPDATE faculty SET password = ?  WHERE faculty_email = ?`;
  const values = [hashedPassword, email];

  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error('Error updating data into database:', err);
      res.status(500).send('Error updating data into database.');
    } else {
      
      res.json({ success: true, message: 'Password changed successfully' });
    }
  });
  
});

const XLSX = require('xlsx');
const { resourceLimits } = require('worker_threads');


const upload = multer({ dest: 'uploads/' });

app.post('/uploadhallticketexcel', upload.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload an Excel file' });
  }

  const excelFilePath = req.file.path;

  try {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const promises = worksheet.map((row) => {
      const query = 'INSERT INTO hallticketnumbers SET ?';
      return new Promise((resolve, reject) => {
        db.query(query, row, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });

    Promise.all(promises)
      .then(() => {
        fs.unlinkSync(excelFilePath);
        res.json({ message: 'File uploaded and data inserted into database' });
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Failed to insert data into database' });
      });
  } catch (err) {
    console.error('Error reading Excel file:', err);
    res.status(500).json({ error: 'Failed to process the Excel file' });
  }
});
app.post('/send-respectiveemail', upload.single('attachment'), (req, res) => {
  const { course, year, subject, message } = req.body;
  const attachment = req.file;

  // Fetch student emails based on selected course and year
  const query = 'SELECT email FROM student WHERE group_name  = ? AND year = ?';
  db.query(query, [course, year], (err, results) => {
      if (err) {
          console.log(err);
          return res.status(500).send('Database query error');
      }

      if (results.length === 0) {
          return res.status(404).send('No students found for the selected course and year');
      }

      // Extract email addresses
      const emailAddresses = results.map(row => row.email);

      // Email options
      const mailOptions = {
          from: 'studentonlinefeedbackbvrc@gmail.com',
          bcc: emailAddresses, // Send email to all fetched students
          subject: subject,
          text: message,
          attachments: attachment ? [{
              filename: attachment.originalname,
              path: attachment.path
          }] : []
      };

      // Send email using Nodemailer
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              res.status(500).send('Error sending email');
          } else {
              console.log('Email sent: ' + info.response);
              res.send('Emails sent successfully');
          }

          // Remove the uploaded file after sending email
          if (attachment) {
              fs.unlink(attachment.path, (err) => {
                  if (err) {
                      console.error('Failed to delete uploaded file:', err);
                  }
              });
          }
      });
  });
});

function sendAttendanceEmailtoStudent(studentId, facultyid, facultySubject, res) {
  const result = `
    SELECT a.student_id, 
           s.fname, 
           s.lname, 
           a.subject_name, 
           s.email, 
           s.rollnumber,
           f.firstname,
           f.lastname,
           COUNT(*) AS attendance_count,
           (SELECT COUNT(DISTINCT date) 
            FROM attendance 
            WHERE faculty_id = a.faculty_id 
              AND subject_name = a.subject_name) AS unique_days_count
    FROM attendance a 
    JOIN student s 
      ON a.student_id = s.student_id
    JOIN faculty f
      ON f.id = a.faculty_id
    WHERE a.faculty_id = ${facultyid} 
      AND a.subject_name = '${facultySubject}'
      AND a.student_id = ${studentId}
    GROUP BY a.student_id, s.fname, s.lname, s.email, s.rollnumber, a.subject_name 
    ORDER BY s.rollnumber ASC;
  `;

  db.query(result, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send('Error executing query');
    }
    if (results.length === 0) {
      return res.status(404).send('No records found for the selected student and subject');
    }

    const result = results[0];
    const emailAddresses = result.email;
    const subject = `Attendance Report for ${result.subject_name}`;
    

    const mailOptions = {
      from: 'studentonlinefeedbackbvrc@gmail.com',
      to: emailAddresses, 
      subject: subject,
      attachments: [{
        filename: 'banner.jpg',
        path: bannerPath,
        cid: 'unique@banner.image' // Same CID as in the HTML img src
    }],
      html: `<img src="cid:unique@banner.image" alt="Banner Image" width="1080px"/>
      <p>Dear ${result.fname} ${result.lname},</p>
    <p>We hope this message finds you well. We would like to share your attendance report for the ${result.subject_name} subject, taught by faculty ${result.firstname} ${result.lastname}.</p>
    <p>Here are your details:</p>
    <ul>
      <li>Subject: ${result.subject_name}</li>
      <li>Roll Number: ${result.rollnumber}</li>
      <li>Total Classes Attended: ${result.attendance_count}</li>
      <li>Total Classes Absent: ${result.unique_days_count - result.attendance_count}</li>
    </ul>
    <p>Thank you for your continued participation and dedication to your studies. Regular attendance is crucial for your academic success, and we encourage you to maintain consistent attendance moving forward.</p>
    <p>If you have any questions or concerns regarding your attendance, please feel free to reach out to us.</p>
    <p>Best regards,<br>[${result.firstname} ${result.lastname}]<br>[B V Raju College]</p>
         
            `,
           
    
    
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        return res.send('Email sent successfully');
      }
    });
  });
}




const port = 3305;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

