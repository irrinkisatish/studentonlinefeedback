# Student Online Feedback System

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#project-api-endpoints)
- [Faculty Module](#faculty-module)


---

## Project Overview

The **Student Online Feedback System** is a web application designed to streamline the feedback process in educational institutions. Students can log in, provide feedback on faculty members, courses, and facilities, while administrators and faculty can view and analyze feedback for continuous improvement. The system includes an attendance module for faculty, allowing them to manage and track attendance.

---



## Features

- **Student Feedback**: Students can submit feedback for courses and faculty via an easy-to-use interface.
- **Admin Dashboard**: Admins can view all feedback, filter it by faculty or course, and generate reports.
- **Faculty Module**: Faculty members can manage student attendance and view anonymous feedback related to their courses.
- **Real-time Notifications**: Admins receive email notifications about new feedback.
- **Secure Authentication**: JWT-based authentication for students, admins, and faculty.
- **Mobile Friendly**: The app is responsive and works across all devices.

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
   git clone https://github.com/yourusername/student-online-feedback-system.git

2. **Navigate into the project directory**:
   ```bash
   cd student-online-feedback-system

3. Install the dependencies:
   ```bash
   npm install
   
4. Run the application:
   ```bash
   npm start
Open your browser and visit http://localhost:3305 to use the application.

# Usage

## Students:
- Students log in using their credentials.
- They can select the faculty or course they wish to provide feedback on.
- Students fill out a form rating different aspects of the course or faculty.

## Admin:
- Admins log in with their credentials to access the dashboard.
- They can view feedback submitted by students, filter by course or faculty, and generate reports.
- Admins receive notifications when new feedback is submitted.

## Faculty:
- Faculty can log in and view the feedback related to their courses.
- Faculty members can give attendance for their classes and view the attendance records.
- Feedback is displayed anonymously, meaning faculty cannot view individual student details for privacy.


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


