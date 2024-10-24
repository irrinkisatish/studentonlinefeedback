# Student Online Feedback System

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Database Creation](#database-setup)
- [Usage](#usage)
- [API Endpoints](#project-api-endpoints)



---

## Project Overview

The **Student Online Feedback System** is a web application designed to streamline the feedback process in educational institutions. Students can log in, provide feedback on faculty members, courses, and facilities, while administrators and faculty can view and analyze feedback for continuous improvement. The system includes an attendance module for faculty, allowing them to manage and track attendance.



https://github.com/user-attachments/assets/12c508f1-a475-4ff9-a5b9-4f99c31bc24d


---



## Features

- **Student Feedback**: Students can submit feedback for courses and faculty via an easy-to-use interface.
- **Admin Dashboard**: Admins can view all feedback, filter it by faculty or course, and generate reports.
- **Faculty Module**: Faculty members can manage student attendance and view anonymous feedback related to their courses.
- **Real-time Notifications**: Students receive email notifications about their attendance.
- **Secure Authentication**: JWT-based authentication for students, admins, and faculty.
- **Mobile Friendly**: The app is responsive and works across all devices.
- **Alumni Feedback**: Alumni can provide feedback on their educational experiences, including suggestions for improvements and ratings for various aspects of their time at the institution.


---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MySQL (with MySQL2 library)
- **Authentication**: JWT (JSON Web Token) for secure login
- **Email Service**: Nodemailer for real-time notifications
- **File Upload**: Multer for handling profile picture uploads
- **Other Libraries**: 
  - `bcrypt` for password hashing
  - `body-parser` for handling HTTP requests
  - `cors` for enabling cross-origin requests

---

## Installation

### Prerequisites
- Install **Node.js**
- Install **MySQL** and create a database named `feedback_system`.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/irrinkisatish/studentonlinefeedback/

2. **Navigate into the project directory**:
   ```bash
   cd studentonlinefeedback

3. Install the dependencies:
   ```bash
   npm install
   
4. Run the application:
   ```bash
   npm start
Open your browser and visit http://localhost:3305 to use the application.

# Database Setup

This project requires a MySQL database setup. The SQL script is provided in the `database` folder and contains the necessary table structures and initial data.

## SQL File Location

The SQL script for setting up the database can be found in the following directory:


## How to Import the SQL File

To import the provided `.sql` file into your MySQL database, follow these steps:

1. Open a terminal or command prompt.
2. Navigate to the folder containing the `.sql` file:
   
   ```bash
   cd /path/to/databasefile
Use the following MySQL command to import the database:

 ```bash
    mysql -u [username] -p [database_name] < yourfile.sql
```
Replace **[username]** with your MySQL username.
Replace **[database_name]** with the name of the database where you want to import the tables.

Replace **studentfeedback_db.sql** with the name of your SQL file.
`Enter your MySQL password when prompted.`
Once the import is complete, your database will be set up with the necessary tables and initial data as defined in the SQL file.

# Usage

### Students:
- **Login**: Students log in using their credentials.
- **Feedback Submission**: They can select the faculty course for which they wish to provide feedback.
- **Rating**: Students fill out a form rating various aspects of the course or faculty, such as teaching effectiveness and course materials.

### Admin:
- **Login**: Admins log in with their credentials to access a comprehensive dashboard.
- **Feedback Management**: They can view all feedback submitted by students and filter it by course or faculty.
- **Reporting**: Admins have the ability to generate reports based on the feedback data.
- **Notifications**: Admins receive notifications when new feedback is submitted, ensuring timely oversight and response.

### Faculty:
- **Login**: Faculty members can log in to view feedback related to their courses.
- **Attendance Management**: Faculty can take attendance for their classes and view attendance records.
- **Anonymous Feedback**: Feedback is displayed anonymously, ensuring that faculty cannot view individual student details, which protects student privacy.

### Alumni:
- **Feedback Submission**: Alumni can provide feedback on their experiences and suggest improvements based on their time at the institution.
- **Comprehensive Feedback Form**: Alumni can rate various aspects of their educational experience, including curriculum relevance, infrastructure facilities, faculty interaction, and overall satisfaction.
- **Continued Engagement**: This system helps maintain a connection between the institution and its alumni, allowing for continuous improvement based on past student experiences.

---

# Authentication Middleware

This application uses two middleware functions to authenticate users: one for students and one for faculty. 

## Middleware Functions

### 1. Student Authentication (`authenticatestudentToken`)

- **Purpose:** Validates the JWT token for students.
- **Response:**
 ```
  - **200 OK:** If the token is valid, the request proceeds to the next route.
  - **401 Unauthorized:** If the token is missing or invalid, a response is sent indicating an invalid JWT token.
  ```
### 2. Faculty Authentication (`authenticatefacultyToken`)

- **Purpose:** Validates the JWT token for faculty members.
- **Response:**
 ```
  - **200 OK:** If the token is valid, the request proceeds to the next route.
  - **401 Unauthorized:** If the token is missing or invalid, a response is sent indicating an invalid JWT token.
```

### Conclusion

These middleware functions ensure secure access to protected routes for both students and faculty members by requiring valid JWT tokens for authentication.

---

# Project API Endpoints

## Student API Endpoints

This API provides endpoints for managing student-related functionalities such as registration, login, feedback submission, and data retrieval.

## Endpoints

### 1. Register a Student
**POST** `/srform`

- **Request Body**:
    ```json
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "password": "password123",
        "phone": "1234567890",
        "dob": "2000-01-01",
        "gender": "Male",
        "address": "123 Main St, City",
        "studentyear": "2",
        "branch": "Computer Science",
        "group": "A",
        "rollnumber": "CS2022001",
        "file": "image.jpg" // (optional file upload)
    }
    ```

- **Response**:
    - **Success**:
        ```json
        {
            "success": true,
            "message": "Registration successful!"
        }
        ```
    - **Error**:
        ```json
        {
            "success": false,
            "message": "Rollnumber not found in hall ticket numbers."
        }
        ```

### 2. Update Student Data
**POST** `/updatestudentdata`

- **Request Body**:
    ```json
    {
        "studentId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "password": "newpassword123",
        "phone": "1234567890",
        "dob": "2000-01-01",
        "gender": "Male",
        "address": "123 Main St, City",
        "studentyear": "3",
        "branch": "Computer Science",
        "group": "B",
        "rollnumber": "CS2022001",
        "file": "new_image.jpg" // (optional file upload)
    }
    ```

- **Response**:
    - **Success**: Redirects to the profile page with a success message.
    - **Error**:
        ```json
        {
            "error": "Error updating data into database."
        }
        ```

### 3. Student Login
**POST** `/studentloginform`

- **Request Body**:
    ```json
    {
        "Email": "john.doe@example.com",
        "password": "password123"
    }
    ```

- **Response**:
    - **Success**:
        ```json
        {
            "token": "JWT_TOKEN"
        }
        ```
    - **Error**:
        ```json
        {
            "error": "Invalid Password"
        }
        ```

### 4. Get Alumni Talks
**GET** `/alumnitalks`

- **Response**:
    - **Success**:
        ```json
        [
            {
                "id": 1,
                "title": "Alumni Talk on AI",
                "date": "2023-10-10",
                "description": "An informative session about AI trends."
            }
            // ...more talks
        ]
        ```

### 5. Get College Events
**GET** `/collegevents`

- **Response**:
    - **Success**:
        ```json
        [
            {
                "eventid": 1,
                "event_name": "Tech Fest",
                "date": "2023-11-20",
                "description": "Annual technology festival."
            }
            // ...more events
        ]
        ```

### 6. Get Faculty Data
**GET** `/api/getFacultyData`

- **Request Headers**:
    - `studentyear`: "2"
    - `studentbranch`: "Computer Science"

- **Response**:
    - **Success**:
        ```json
        [
            {
                "id": 1,
                "firstname": "Dr. Smith",
                "lastname": "Johnson",
                "teaching_year": "2",
                "teaching_group": "Computer Science"
            }
            // ...more faculty
        ]
        ```

### 7. Submit Student Feedback
**POST** `/studentfeedback`

- **Request Body**:
    ```json
    {
        "groupname": "A",
        "facultyId": 1,
        "syllabus_covered": "90%",
        "teacheruses_tools": "Yes",
        "prepapreforclasses": "Good",
        "teaching_approrach": "Excellent",
        "identifytoovercome": "Yes",
        "teachercommunicate": "Very Good",
        "teacherillustrate": "Good",
        "teacherencourage": "Yes",
        "teacherperdiscess": "Satisfactory",
        "teacherfairneess": "Excellent",
        "feedback": "Great teacher!"
    }
    ```

- **Response**:
    - **Success**:
        ```json
        {
            "message": "success"
        }
        ```
    - **Error**:
        ```json
        {
            "error": "Error inserting feedback data into database."
        }
        ```

### 8. Search for Faculty
**GET** `/searchrequest`

- **Request Query**:
    - `firstname`: "John"

- **Response**:
    - **Success**:
        ```json
        [
            {
                "id": 1,
                "firstname": "John",
                "lastname": "Doe"
            }
            // ...more faculty
        ]
        ```
    - **Error**:
        ```json
        {
            "error": "Error fetching faculty data."
        }
        ```

### 9. Go to Student Profile
**GET** `/studentgoprofile`

- **Response**:
    - **Success**:
        ```json
        {
            "studentId": 1
        }
        ```

### 10. Get Student Profile Data
**GET** `/studentProfileData`

- **Request Query**:
    - `id`: 1

- **Response**:
    - **Success**:
        ```json
        [
            {
                "student_id": 1,
                "fname": "John",
                "lname": "Doe",
                "feedbackId": 1,
                "feedback_text": "Great teacher!"
                // ...other profile data
            }
        ]
        ```

### 11. Update Faculty Feedback
**POST** `/updatefacultyfeedback`

- **Request Body**:
    ```json
    {
        "feedback_id": 1,
        "studentid": 1,
        "syllabus_covered": "100%",
        "teacheruses_tools": "Yes",
        "prepapreforclasses": "Excellent",
        "teaching_approrach": "Very Good",
        "identifytoovercome": "Yes",
        "teachercommunicate": "Excellent",
        "teacherillustrate": "Excellent",
        "teacherencourage": "Yes",
        "teacherperdiscess": "Good",
        "teacherfairneess": "Very Good",
        "feedback": "Updated feedback text."
    }
    ```

- **Response**:
    - **Success**: Redirects to the student profile page.
    - **Error**:
        ```json
        {
            "error": "Error updating feedback."
        }
        ```

### 12. Logout Student
**GET** `/studentlogout`

- **Response**:
    - **Success**:
        ```json
        {
            "message": "Logout successful"
        }
        ```

### Authentication
All requests that require authentication should include a JWT token in the `Authorization` header as a Bearer token.


## Faculty API Endpoints
This is a RESTful API for managing faculty data, student feedback, attendance, and related functionalities within an academic setting.

### 1. Faculty Login
- **POST**: `/facultylogin`
- **Request Body**:
    ```json
    {
      "Email": "faculty_email@example.com",
      "password": "your_password"
    }
    ```
- **Response**:
    - `200 OK`: Returns a JWT token.
    - `400 Bad Request`: Invalid email or password.

### 2. Register Faculty
- **POST**: `/registerfaculty`
- **Request Body**:
    - Form-data including:
      - `firstName`
      - `lastName`
      - `email`
      - `password`
      - `phone`
      - `dob`
      - `gender`
      - `address`
      - `teaching_year`
      - `selected_group`
      - `selected_subject`
      - `selected_branch`
      - `file` (image)
- **Response**:
    - `200 OK`: Redirects to login page with success message.
    - `500 Internal Server Error`: Error inserting data into the database.

### 3. Fetch Feedback Details
- **GET**: `/api/facultyfeedback`
- **Headers**: 
    - `id`: Faculty ID
- **Response**:
    - `200 OK`: Returns feedback details.
    - `404 Not Found`: No data found for the given criteria.
    - `500 Internal Server Error`: Error fetching data.

### 4. Search Faculty Feedback
- **POST**: `/api/searchfacultyfeedback`
- **Request Body**:
    ```json
    {
      "studentyear": "year_value",
      "studentsubject": "subject_value",
      "studentclass": "class_value"
    }
    ```
- **Response**:
    - `200 OK`: Returns matching feedback details.
    - `404 Not Found`: No data found for the given criteria.
    - `500 Internal Server Error`: Error fetching data.

### 5. Get Faculty Details
- **GET**: `/api/facultydetailsget`
- **Response**:
    - `200 OK`: Returns faculty details.
    - `401 Unauthorized`: Invalid or missing token.

### 6. Fetch Students
- **POST**: `/api/students`
- **Request Body**:
    ```json
    {
      "studentyear": "year_value",
      "studentgroup": "group_value"
    }
    ```
- **Response**:
    - `200 OK`: Returns a list of students.
    - `500 Internal Server Error`: Error executing query.

### 7. Search Students
- **GET**: `/faculty/searchstudents`
- **Query Parameters**:
    - `firstname`: Search term for student name.
    - `studentyear`: Year of the student.
    - `studentbranch`: Branch of the student.
- **Response**:
    - `200 OK`: Returns matching students.
    - `500 Internal Server Error`: Error fetching search results.

### 8. Fetch Attendance Students
- **GET**: `/fetch_attendance_students`
- **Query Parameters**:
    - `year`: Selected year.
    - `group`: Selected group.
- **Response**:
    - `200 OK`: Returns HTML table of students for attendance.
    - `500 Internal Server Error`: Error executing query.

### 9. Submit Attendance
- **POST**: ` /submitAttendance`
- **Request Body**:
    ```json
    {
      "facultyid": "faculty_id",
      "teachingsubject": "subject_name",
      "teachingbranch": "branch_name",
      "teachingyears": "years",
      "students": ["student_id_1", "student_id_2"],
      "date": "YYYY-MM-DD"
    }
    ```
- **Response**:
    - `200 OK`: Redirects with success message.
    - `400 Bad Request`: Invalid students data.
    - `500 Internal Server Error`: Error handling attendance submission.

### 10. Fetch Attendance Data
- **POST**: ` /fetchAttendanceData`
- **Request Body**:
    ```json
    {
      "attfacultyid": "faculty_id",
      "studentyear": "year_value",
      "studentclass": "class_value",
      "studentsubject": "subject_name",
      "todate": "YYYY-MM-DD",
      "fromdate": "YYYY-MM-DD"
    }
    ```
- **Response**:
    - `200 OK`: Returns attendance data in HTML format.
    - `500 Internal Server Error`: Error executing query.

### 11. Get Faculty Profile
- **GET**: ` /facultyprofile`
- **Response**:
    - `200 OK`: Returns faculty profile.
    - `401 Unauthorized`: Invalid or missing token.

### 12. Update Faculty Data
- **POST**: ` /updatesfacultydata`
- **Request Body**:
    - Form-data including faculty details.
- **Response**:
    - `200 OK`: Redirects with success message.
    - `500 Internal Server Error`: Error updating data.

### 13. Fetch College Events
- **GET**: ` /facultycollegevents`
- **Response**:
    - `200 OK`: Returns college events.
    - `500 Internal Server Error`: Error fetching events.

### 14. Fetch Alumni Talks
- **GET**: ` /facultyalumnitalks`
- **Response**:
    - `200 OK`: Returns alumni talks.
    - `500 Internal Server Error`: Error fetching talks.

### 15. Faculty Logout
- **GET**: `/facultylogout`
- **Response**:
    - `200 OK`: Returns logout success message.
    - `401 Unauthorized`: Invalid or missing token.

## Error Handling
All API responses include appropriate status codes and messages to indicate success or failure. Ensure to handle these responses in your front-end application.

---
# Admin API 

This document outlines the available API endpoints for the Student Online Feedback System's admin module, detailing the request formats, response structures, and descriptions of each endpoint.

## API Endpoints

### 1. Get All Groups
**GET**: ` /formgroups`  
Fetches all groups from the `group_details` table.

- **Response**:  
  List of groups.

**Example Response**:
    ```json
        [
         {"group_id": 1, "group_name": "Group A"},
      {"group_id": 2, "group_name": "Group B"}
     ]```
     
### 2. Get Subjects by Group ID
**GET**:  /subjects/:groupId
Fetches subjects related to a specific group.

**Parameters:**
`groupId: The ID of the group.`

**Response:**
`List of subjects related to the group.`

Example Response:

    ```json
      [
         {"subject_id": 1, "subject_name": "Mathematics"},
             {"subject_id": 2, "subject_name": "Science"}
       ]
       ```
       
### 3. Add a Row to a Table

**POST**:  /add-row/:tableName
Adds a row to the specified table.

- **Parameters:**
`tableName: The name of the table.`

- **Request Body:**
`Key-value pairs representing the data to insert.`

- **Response:**
`Message confirming successful row addition.`

Example Response:
```json
{
  "message": "Row added successfully"
}
```
### 4. Delete a Row from a Table

- **POST**:  /delete-row/:tableName
Deletes a row from the specified table.

- **Parameters:**
tableName: The name of the table.

- **Request Body:**
`id: The ID of the row to delete.`

- **Response:**
`Message confirming successful deletion.`

Example Response:

```json

{
  "message": "Row deleted successfully"
}
```

### 5. Get All Students

- **GET**:  /adminapi/students
Fetches all students in descending order based on student_id.

- **Response:**
List of students excluding passwords.
Example Response:

```json

[
  {"student_id": 1, "name": "John Doe", "email": "john@example.com"},
  {"student_id": 2, "name": "Jane Doe", "email": "jane@example.com"}
]
```
### 6.  Delete a Student Record
- **DELETE:**  /apidelete/students/:id
Deletes a student record.

- **Parameters:**
`id: The ID of the student.`

- **Response:**
`204 No Content on success.`

### 7. Get All Faculty

- **GET**:  /apiadmin/faculty
Fetches all faculty records.

- **Response:**
List of faculty excluding passwords.

- **Example Response:**

```json

[
  {"id": 1, "name": "Dr. Smith", "email": "smith@example.com"},
  {"id": 2, "name": "Dr. Brown", "email": "brown@example.com"}
]
```
### 8. Delete a Faculty Record

- **DELETE**:  /apidelete/faculty/:id
Deletes a faculty record.

- **Parameters:**
`id: The ID of the faculty.`

- **Response:**
`204 No Content on success.`

### 9. Fetch Feedback Data

- **GET**:  /apiadmin/feedback
Fetches feedback data along with average overall feedback for each faculty.

- **Response:**
`Feedback details along with computed averages.`

- **Example Response:**

```json

[
  {
    "student_id": 1,
    "faculty_id": 2,
    "subjectName": "Mathematics",
    "teaching_approrach": 8,
    "syllabus_covered": 9,
    "overall_average": 8.5
  }
]
```

### 10. Search Students Based on Course and Year

- **GET**:  /search-students
Searches students based on course and year.

- **Query Parameters:**
``
course: The name of the course.
year: The year of study.
``

- **Response:**
`List of students.`

- **Example Response:**

```json

[
  {"student_id": 1, "name": "John Doe", "rollnumber": "101"},
  {"student_id": 2, "name": "Jane Doe", "rollnumber": "102"}
]
```
### 11. Alumni Talks Upload

- **POST**:  /alumnitalkserverpost
Uploads alumni talk details including images and videos.

- **Request Body:**

alumniname: Name of the alumni.
alumnitopic: Topic of the talk.
alumniabout: About the alumni.

- **Files:**

alumniimage: Image of the alumni.
alumnivideo: Video of the talk.

- **Response:**
`Redirects to the admin page upon success.`

### 12. Event Post Upload

- **POST**:  /eventpostserver
Uploads event details including images and videos.

- **Request Body:**
  
```
eventname: Name of the event.
eventtopic: Topic of the event.
eventabout: Description of the event.

**Files:**
eventimage: Image of the event.
eventvideo: Video of the event.

```
- **Response:**
`Redirects to the admin page upon success.`

### 13. Admin Logout

- **GET**: /adminlogout
Logs out the admin.

- **Response:**
`Message confirming successful logout.`

- **Example Response:**

```json

{
  "message": "Logout successful"
}
```

### 14. Admin Login

- **POST**:  /loginadmin
Logs in the admin.

- **Request Body:**

```json
{
username: Admin username.
password: Admin password.
}
```
- **Response:**

`Redirects to the admin page upon successful login.`

### 15. Fetch Alumni Feedback

- **GET**:  /api/indedoverallfacFeedback
Fetches aggregated alumni feedback data.

- **Response:**
`Aggregated feedback averages.`
- **Example Response:**

```json

[
  {
    "avg_syllabus_covered": 8.5,
    "avg_teacheruses_tools": 9.0,
    "overall_average": 8.75
  }
]
```

### 16. Upload Hall Ticket Excel

- **POST**:  /uploadhallticketexcel
Uploads an Excel file containing hall ticket data.

Files:

excelFile: The Excel file to upload.
- **Response:**
`Message confirming data insertion.`

- **Example Response:**

```json

{
  "message": "File uploaded and data inserted into database"
}
```

### 17. Send Emails with Attachments

- **POST**:  /send-respectiveemail
Sends emails to students of a specific course and year with optional attachments.

- **Request Body:**

course: The course name.
year: The year of study.
subject: The email subject.
message: The email message.

Files:

attachment: Optional email attachment.

- **Response:**
`Message confirming successful email sending.`

```json
{
  "message": "Emails sent successfully"
}
```

### 18. Fetch Faculty Feedback

- **Endpoint:** `/api/faculty-feedback`

- **Method:** `GET`

- **Query Parameters:**
- `course`: The course for which feedback is requested.
- `year`: The year of the course.
- `subject`: The subject for which feedback is requested.
- `name`: The full name of the faculty (first and last).

- **Response:**
`Returns an array of feedback objects containing details about student feedback, including scores on various aspects of teaching.`

-  **Example Request:**
```http
GET /api/faculty-feedback?course=CS&year=2023&subject=Data+Structures&name=John+Doe
```
### 19. Fetch Alumni Feedback by Course
- **Endpoint:** /api/alumni-feedback

- **Method:** GET

- **Query Parameters:**

course: The course for which alumni feedback is requested.
Response: Returns alumni feedback data, including personal details and ratings, related to their course experience.

- **Example Request:**

```http
GET /api/alumni-feedback?course=CS
```

### 20. Fetch All Alumni Feedback

- **Endpoint:** /api/alumniFeedback

- **Method:** GET

- **Response:**
  
`Returns all alumni feedback data along with an overall average rating across all alumni.`

- **Example Request:**

```http

GET /api/alumniFeedback
```

**Database Structure**
- **Feedback Table**
```
rollnumber: Roll number of the student.
firstname: First name of the faculty.
lastname: Last name of the faculty.
feedback_text: The feedback text from the student.
subjectName: The name of the subject.
Other teaching-related evaluation metrics.
```

- **Alumni Table**
```
alumni_id: Unique identifier for the alumnus.
name_of_alumnus: Name of the alumnus.
year: Graduation year.
rating: Overall rating.
course: The course completed.
Feedback Answers and Questions Tables
```
# Alumni Feedback API 

This document provides an overview of the Alumni Feedback API, including endpoint descriptions, request and response formats, and example usage.

## API Endpoints

### 1. Submit Alumni Feedback

- **POST:** ` /submitAlumniFeedback`

- **Description:** 
This endpoint allows alumni to submit feedback regarding their experience at the institution. It captures various aspects of the alumni's experience, including curriculum relevance, infrastructure, faculty interaction, and overall satisfaction.

- #### Request

 **Headers:**
 `Content-Type: application/json`

 **Body:**
```json
{
  "name": "John Doe",
  "year": "2023",
  "statusaddress": "123 Main St, City",
  "number": "1234567890",
  "email": "johndoe@example.com",
  "course": "Computer Science",
  "suggestion_text": "Great program, but could improve labs.",
  "rating": 5,
  "relevance_of_curriculum": "Very relevant",
  "infrastructure_facilities": "Good",
  "guest_lecturers_arrangement": "Satisfactory",
  "student_teacher_interaction": "Excellent",
  "cooperation_from_staff": "Good",
  "teaching_faculties_availability": "Very available",
  "overall_facilities_satisfaction": "Satisfied",
  "contribution_to_college": "Very good"
}
```

### Response

- **Success Response:**

```
Status Code: 302 Found
Location: Redirects to alumni.html with success message
```

**Error Response:**

`Status Code: 500 Internal Server Error`

- **Body:**
- 
```json
{
  "error": "Error submitting alumni feedback."
}
```
Note: All responses will include appropriate error messages if any issues occur during the execution of the request.

