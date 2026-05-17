Chapter 1	
Introduction
1.1	Background
Vietnamese German University (VGU) has the need to manage attendance information for many modules, lecturers, students, and academic staff. CAMWA is developed to support this attendance management process in digital way. However, the legacy version has several severe problems on the front-end that required attention and updated implementation, such as API routing mismatch between backend and front-end, legacy authentication still use expired Firebase Auth when backend already have its own authentication implemented.
Front-end is the part that users directly see and use in reality. If the interface is unclear, users cannot use the system well even if the backend worked and provided the correct data. In this thesis, the focus is to improve the front-end implementation of CAMWA. The project will be refactored with new implementation of the dashboard. It will be built using modules method, where each logic component is separated to fit their flow for easier maintenance and scalability. The front-end communicates with the backend using REST API, through HTTP Request and Angular service, and is implemented within login, dashboard, module view, request view, and account page.
1.2	Problem Statement
CAMWA front-end is currently developed using Angular and styling using Bootstrap5. The legacy version implementation has several problems that affect the completeness and maintainability of the system. First, the legacy code contained many role-based screens such as Admin, Faculty Assistant, Academic Coordinator, Lecturer, and Student, while not every screen has the same level of connection with the backend services. Some parts of the front-end already work with real services, for example the login flow and the admin dashboard attendance analytics, but some module view, request view, and account management pages still keep local data inside the component, so the user interface can show the layout and expected function but it does not fully represent the complete data flow of the system yet. Second, legacy code stores token, role, and user id in localStorage after login and uses route guard to check whether token exists, but the role permission in the routes is still not strongly controlled from the front-end side, therefore the navigation protection is still simple and mostly depends on the existing token. Third, the structure uses Angular bootstrapping and main route configuration, but older Angular module and routing files are still kept inside the project, which can make the architecture look mixed and difficult for another developer to understand which part is currently active. The API connection is also repeated in several services, because authorization header is added by each service instead of one central HTTP interceptor, so the code can become harder to maintain when the system grows. 
Therefore, in this thesis, CAMWA front-end needs to be refactored to support the main attendance management workflow, organize the role-based user interface, connect important pages with backend services, and identify which current parts are already functional and which parts still remain as incomplete front-end implementation.
1.3	Objectives
The main objective of this thesis is to refactor CAMWA front-end, so the attendance management system can be used through a clear web interface and not only exist as backend services. The front-end should communicate with the backend through REST API and Angular service, use the authentication that the backend already provides, and remove the dependency on the old Firebase Auth flow that does not fit the current system anymore. The first tasks is to reconstruct the codebase into a more maintainable Angular implementation, where the application has clear routing, separated pages, reusable components, and service files that match with the main user flow such as login, dashboard, module view, request view, profile, and account management. This is needed because the old front-end structure still contains mixed implementation and some parts are difficult to understand when the project grows. Second objective is to implement role-based user interface for Admin, Faculty Assistant, Academic Coordinator, Lecturer, and Student, because each role has different responsibilities in the attendance management process and the front-end should guide the user to the correct page after login based on their role. The role-based interface also makes the system easier to use, because the user does not need to see all functions that are not related to their task. Third objective is to rebuild and improve the dashboard implementation, especially the part that shows attendance analytics, chart, and summary information, so the front-end can present backend data in visual way instead of only showing plain table or static information. This objective also includes organizing the dashboard logic into suitable modules or components, so the data flow and UI rendering can be easier to maintain.

Some pages can still remain as interface implementation when backend data is not fully connected yet, but the thesis should clearly identify which parts are already functional and which parts are prepared for later integration.
1.4	Scope and Limitation
This thesis focuses on front-end optimization, which does not involve modifying or changing much logic on the existing Express.js backend. The front-end remains some of the legacy code to ensure that the user interface continues to function correctly while benefiting from different modifications. The scope includes the Angular web application, role-based pages, dashboard implementation, routing, sidebar navigation, form handling, chart display, and connection between frontend components and backend services through REST API and Angular services. The work also includes replacing the old authentication direction in the front-end with the backend authentication flow, so the login process, stored token, role, and user id can be used by the front-end to redirect user to the suitable page. 

The limitations are, every page has the same level of backend integration. For example, dashboard analytics and login already use service connection, while some module view, request view, and account management parts still contain local data or front-end structure to represent how the page should work. Another limitation is the role permission is not fully strict in every route from the frontend side, and the authorization header is still added in several services instead of being handled by one central HTTP interceptor. This is acceptable for the scope of this frontend implementation, but it also means the frontend security and maintainability can still be improved in future work. 

The thesis also does not include formal usability testing with VGU staff and students, mobile application development, or production deployment testing. The interface is built to work as a web application and uses Bootstrap and Angular components, but detailed accessibility checking, performance testing, and real user acceptance testing are not included in this scope. Therefore, the current version is considered complete for thesis submission, but there are still improvements that can be done if the system is prepared for full production use later.
1.5	Thesis Structure
This thesis is organized into six chapters. Chapter 1 introduces the background of CAMWA, the problem statement, the objectives, and the scope and limitations of the front-end implementation. This chapter explains why the front-end is important for the attendance management system, because it is the part that users directly interact with when using login, dashboard, module view, request view, and account management functions.

Chapter 2 analyzes the legacy CAMWA front-end and the existing system condition before the refactoring work. This chapter discusses the main problems found in the legacy code, such as old Firebase authentication direction, API routing mismatch between front-end and backend, mixed Angular structure, repeated service logic, and role-based pages that do not have the same level of backend integration. It also explains which parts of the old implementation can still be reused and which parts need to be changed for the current thesis work.

Chapter 3 explains the backend overview that is needed for front-end integration. Since this thesis is focused on the front-end, the backend is not redesigned in this chapter, but it is described to show how the front-end communicates with the system through REST API, JWT authentication, role-based access control, and important service endpoints such as login, dashboard analytics, attendance, modules, requests, and account data.

Chapter 4 presents the front-end design and refactoring approach. This chapter describes the Angular structure, routing design, component organization, service layer, sidebar navigation, dashboard layout, chart display, and role-based user interface for Admin, Faculty Assistant, Academic Coordinator, Lecturer, and Student. It also explains how the front-end is separated into pages and logic parts so the code can be easier to maintain and extend.

Chapter 5 describes the implementation result of the CAMWA front-end. This chapter shows how the main pages are implemented, how the login flow works with backend authentication, how dashboard data is displayed, and how module view, request view, profile, and account pages are organized. It also identifies which parts already use real backend data and which parts still remain as front-end structure or local data because of project limitation.

Chapter 6 concludes the thesis by summarizing the achieved results, remaining limitations, and possible future improvements. The future work includes completing backend integration for all pages, improving role permission in the front-end, adding a central HTTP interceptor, improving loading and error handling, and preparing the system for usability testing and production deployment.
Chapter 2	
Literature Review and System Analysis
2.1	Literature Review
In modern web application development, the front-end is not only a display layer, but also an important part for organizing user workflow, page navigation, and communication with backend services. Angular is a web framework that supports building fast and reliable applications, and it provides important features such as components, dependency injection, routing, forms, and HTTP client support [1]. Because of this, Angular is suitable for systems that need many pages, repeated user interface patterns, and maintainable code structure. In a role-based attendance management system like CAMWA, the separation into pages, components, and services is important because each user group needs a different view, but the project should still keep one consistent application structure.

Routing is also a major concept in front-end architecture, because users move through the system by page navigation rather than by directly calling backend functions. Angular routing supports navigation between pages and also supports route guards, which are useful when some pages should only be opened after login [1]. For this reason, a front-end that is designed around clear route structure can improve usability and also reduce confusion when different roles need different dashboard, module, or request pages. In practice, this means the front-end architecture should not only focus on visual design, but also on how each page is connected and how the user flow is controlled after authentication.

Another important topic is communication between front-end and backend through HTTP. According to MDN, HTTP is the foundation of data exchange on the Web and follows a client-server model where the browser sends requests and the server returns responses [2]. This concept is directly related to modern single-page applications, because the front-end depends on HTTP requests to get data such as login result, dashboard analytics, module information, and attendance request records. Therefore, the design of front-end services should be consistent, reusable, and easy to maintain, because repeated or unclear API communication can create errors and make future refactoring more difficult.

For user interface design, Bootstrap is a widely used front-end toolkit that helps developers build responsive layouts and common interface components more quickly [3]. Bootstrap also follows a mobile-first design approach, which is important because web systems today may be opened on different screen sizes and devices. In an attendance management system, responsive layout, tables, forms, navigation, alerts, and modal dialogs are practical interface elements because they help users read data, submit information, and move between workflows with less confusion. Using a UI toolkit does not automatically make the system good, but it provides a stable base for building consistent page layouts and reusable interface patterns.

Security awareness is also necessary in front-end development even when the backend performs final authorization. OWASP describes the Top Ten as a standard awareness document about the most critical web application security risks [4]. For front-end implementation, this is relevant because the client side still handles tokens, form input, request headers, route protection, and user session behavior. A front-end should therefore avoid weak integration patterns, should not rely only on visual hiding for permission control, and should follow the backend authentication flow in a consistent way. In CAMWA, this literature is useful because the project includes role-based pages, protected routes, and authenticated API requests, so the front-end design should consider maintainability and basic security practice at the same time.

2.2	Analysis of the Existing System
The existing CAMWA system already has a backend foundation that supports the main attendance management workflow. The backend provides structured API endpoints, JWT-based authentication, role-based access control, and relational data models for entities such as Student, Lecturer, Program, Intake, Semester, Module, IntakeModule, ModuleRegistration, Attendance, AttendanceRequest, Exam, Notification, and ImageAsset. One important design in the backend is the use of `intake_module_id` in attendance-related operations, because the attendance process is not only related to a general module name, but to a specific module offering in one academic context. This part of the system is important for the front-end thesis because the front-end pages do not work independently, but must request data from this backend structure and display it in a usable way for different roles.

However, the way the legacy front-end connected to this backend was not clean and not fully consistent. The project previously contained mixed authentication direction, where older Firebase-related implementation still existed while the backend already had its own login flow and JWT-based protection. The route and API connection structure in the front-end was also uneven, because some pages already used Angular services and backend endpoints, while some other pages still depended on local data stored inside the component. This made the user interface look partially complete, but the real data flow was not implemented in the same level for all pages. In addition, the project contained mixed Angular structure, because the newer routing and bootstrapping approach existed together with older module and routing files, which made the codebase harder to understand and maintain.

The backend itself is also not completely without limitation. The role structure is functional for the main roles such as Admin, Faculty Assistant, Lecturer, Student, and some Academic Coordinator related pages, but advanced role behavior is still not fully complete. The authentication flow already supports login and token-based access for protected endpoints, but the front-end integration around this flow was previously not organized well enough. In practice, the legacy front-end stored token, role, and user id after login, but route protection on the client side was still simple and some authorization headers were added repeatedly in different services instead of being handled in one central place. This caused duplication and made the maintenance effort higher when new pages or new service calls were added.

Based on these issues, the focus of the current thesis is not to rebuild the backend again, but to fix the front-end side so it can connect to the existing backend in a more correct and maintainable way. The current work refactors the front-end structure, aligns the login flow with backend authentication, improves the dashboard implementation, organizes role-based pages more clearly, and uses Angular services and routing as the main connection layer between user interface and backend APIs. At the same time, this thesis also identifies that not every page has fully completed backend integration yet, so part of the work is to separate which pages are already functional with real API data and which pages still remain as interface structure for later connection. In this way, the existing system analysis shows both the value of the current backend foundation and the reason why front-end refactoring is necessary for CAMWA.


Chapter 3	
System Design and Architecture
3.1	System Architecture
The CAMWA backend is designed using layered architecture that separates request routing, access control, business logic, and data persistence. By separating responsibilities into different layers, the system becomes easier to maintain and scale.

The routing layer acts as the entry point of the backend API. It receives HTTP requests from the client and uses the appropriate endpoint based on the requested resource, such as authentication, attendance, students, lecturers, modules, dashboard, accounts, or notifications. This layer does not perform core business processing, but forwards requests to middleware and controllers so the API structure can remain organized and resource-oriented. The middleware layer processes requests before they reach the controller. In CAMWA, middleware is mainly used for authentication and authorization. The authentication middleware verifies JWT access tokens and identifies the user making the request, while the authorization middleware checks whether the user has the required role to access a protected endpoint. This supports Role-Based Access Control for roles such as ADMIN, FACULTY, LECTURER, STUDENT, and AC-related routes.

The controller layer manages the request and response flow. Controllers read request parameters or body data, call the appropriate service function, and return the result to the client. They act as coordinators between the API layer and the business logic layer. Keeping controllers lightweight helps prevent duplicated logic and makes the system easier to modify when endpoint behavior changes. The service layer contains the main business logic of the system. Service functions are responsible for operations such as validating module registration, creating attendance records, processing attendance correction requests, calculating attendance rates, generating exam eligibility records, sending notifications, processing Excel files, and handling protected asset access. Placing these operations in services improves reusability because the same business logic can be used by different controllers or workflows.

The database model provides access to the PostgreSQL database through Sequelize ORM. It defines the main entities of the system, including Iam, Student, Lecturer, Program, Intake, Semester, Module, IntakeModule, ModuleRegistration, Attendance, AttendanceRequest, Exam, Notification, and ImageAsset. The model layer also defines relationships between these entities. In the current design, attendance-related records use `intake_module_id` to reference a specific module offering, which creates a clearer relationship between students, lecturers, module registrations, attendance records, correction requests, and exam eligibility records.
 
Figure 3 1: System Architecture layers
This architecture promotes scalability by allowing independent modification of each layer, facilitates testing through clear interfaces between components, and supports maintainability by organizing code according to functional responsibilities.
3.2	3.2	Database Redesign
The database redesign addresses the fundamental technical deficiencies of the legacy schema by introducing several optimized domains and optimization required to serve production environment, listed and displayed in Table 3 1.

Table 3 1: Database Schema Comparison – Original vs Optimized
Aspect	Original Schema	Optimized Schema
Terminology	Inconsistent (class/course)	Standardized (module)
Academic Coordinator	Not supported	Dedicated table with RBAC support
Security Features	Basic authentication only	Enhanced with brute-force mitigation
Notification System	Basic notifications	Centralized with status tracking
Asset Management	No image/video support	ImageAsset table with cloud integration
Data Redundancy	High redundancy	Normalized with minimal redundancy
Schema Complexity	Included irrelevant fields (ECTS, etc.)	Optimized for attendance-centric logic

The CAMWA database is implemented through SequelizeORM, which maps JavaScript model definitions to PostgreSQL tables. This approach allows the backend to define table fields, constraints, indexes, and relationships directly in the application code. Instead of writing all database interaction as raw SQL, the system uses Sequelize models to create a consistent data access layer for authentication, academic records, attendance workflows, notification handling, and asset management.
3.3	3.3	API and Feature Design
The CAMWA API is designed around REST endpoints, meaning the API is group related functions by resource. The root router connects the main backend areas, including authentication, attendance, modules, students, lecturers, programs, faculty operations, dashboard data, accounts, semesters, intakes, module registrations, and notifications. This organization allows each feature area to be maintained in its own route, controller, and service files while still being accessed through one backend API (see Figure 3 2).
 
Figure 3 2: New database schema
3.3.1	Security Feature Design
The authentication is secured through dual-token JWT stateless architecture, using short-lived access tokens and long-lived refresh tokens for session management. This approach can prevent rainbow table attacks and ensure passwords are irreversible in case there is an event of data breach. The JWT authentication system generates short-lived tokens (5 minutes) with timestamps to prevent replay attacks.
 
Figure 3 3: Authentication Sequence Diagram
The security system stores academic and attendance information that should only be accessed by authorized users. When a user submits login credentials to the authentication endpoint. The backend searches for the matching account in the `Iam` model and verifies the submitted password against the stored password hash. Storing hashed passwords is important because it prevents plaintext passwords from being exposed directly if account data is leaked. After a successful login, the backend generates JWT-based tokens for the authenticated user. The access token is used by the client to call protected API endpoints, while the refresh token supports session continuation when a new access token is needed. The refresh token is stored in the account record so that the backend can validate refresh requests against the current saved token. This design gives the system a basic session management mechanism without requiring the backend to store every access token separately. Protected routes use middleware to verify the access token before allowing the request to continue. If the token is missing, invalid, or expired, the request is rejected. If the token is valid, the middleware identifies the user and allows the request to proceed to the next layer. This keeps authentication checks separate from controller and service logic, which makes the API easier to maintain. Authorization is handled through Role-Based Access Control. After a user is authenticated, the backend checks whether the user's role is allowed to access the requested endpoint. The current system supports main roles such as ADMIN, FACULTY, LECTURER, STUDENT, and AC-related access where available. This separation is important because each role has different responsibilities. For example, students should mainly access their own attendance information and correction requests, while lecturers and faculty users may access broader attendance and administrative functions. See Figure 3 3 for the sequence diagram explaining the flow.
3.3.1	3.3.2	Role Management Design
The role management design in CAMWA is based on Role-Based Access Control. Each account in the `Iam` model contains a role value that represents the user's main responsibility in the system. The current backend uses this role during authorization checks to decide whether a user is allowed to access a protected endpoint. This design is necessary because the system contains different types of users, and each user group should only access the functions related to its responsibility. Figure 3 4 illustrates the flow of authentication. The design separates authentication from authorization. Authentication answers the question of whether the user is a valid logged-in user, while authorization answers the question of whether that user is allowed to perform the requested action. This separation makes the backend easier to maintain because route protection rules can be managed through middleware instead of duplicating inside every controller or service function.

 
Figure 3 4: Role-Based Access Control Flow
3.3.2	3.3.3	Attendance and Data Processing Design
The attendance and data processing design focuses on storing attendance records accurately and supporting spreadsheet-based workflows used in academic administration. Each attendance record connects a student with an `intake_module_id` and an attendance status such as present, absent, late, or excused. Field `intake_module_id` ensures that attendance is recorded for a specific module offering rather than only for a general module name. This also helps prevent incorrect attendance records from being stored for students who do not belong to the selected academic context.

The system also supports Excel-based input for attendance-related data. During import, the backend reads the spreadsheet row by row and checks whether required fields such as student identifier, intake module identifier, and attendance status are available. The attendance status is validated against the accepted values before the record is created. Valid rows are processed as successful results, while invalid rows are returned as failed results with error information. This allows staff to identify problems in the uploaded file without stopping the whole import process.
3.3.3	3.3.4	Attendance Correction and Reporting Design
The correction request design allows students to request changes when they believe an attendance record is incorrect. A correction request stores the related attendance record, student, intake module, proposed status, reason, request status, and processing information. Authorized users can review the request and approve or reject it. If the request is approved, the attendance record can be updated while the request record remains as a review history. This design separates the original attendance data from the correction workflow and improves traceability.

The reporting design is mainly connected to exam eligibility. The backend calculates attendance rates for students in each intake module and stores the result in the `Exam` model. The exam record includes the student, `intake_module_id`, attendance rate, and eligibility result. The system can then export eligibility information into Excel files so lecturers or faculty users can review attendance-based exam status in a familiar format.

Chapter 4	
Dashboard Front-end Implementation
This chapter explains the front-end implementation completed in this thesis. Although the CAMWA project contains many pages such as login, module view, request view, account management, and profile pages, the main implementation scope of this thesis is only the dashboard front-end. This means the chapter focuses on how the dashboard interface was built, how attendance-related information is presented visually, and how notification information is displayed to the user.

The dashboard front-end is implemented using Angular and Bootstrap 5. It works with the existing backend by requesting available dashboard data and showing the returned results in the user interface. In this thesis, the main contribution is not backend redesign, but the implementation of the user-facing dashboard layer, especially graphing and notification features. These features are important because users need to see attendance summaries, trends, and important updates quickly after logging into the system.

The dashboard is also designed to support role-based use in CAMWA. Different roles may need different summary information, but the main goal is the same, which is to provide a clear and simple overview of important data in one place. For this reason, the dashboard implementation separates layout structure, reusable interface elements, and service-based data communication so that the front-end can be extended more easily in future work.
4.1	Dashboard Page Structure
In this thesis, the main dashboard implementation is shown through `dashboard-admin.component.ts` and `dashboard-admin.component.html`. This page is the main place where the user can see attendance summary, charts, and notifications. The page is written as a standalone Angular component and imports `CommonModule` and `FormsModule`. This setup allows the page to use Angular data binding, conditions such as `*ngIf`, loops such as `*ngFor`, and form input binding for the graph view selection.

The HTML layout is divided into a few simple parts. At the top, there is the page title and the notification bell. Below that, the left side contains the main charts, while the right side contains summary cards and another chart section. The page also includes cards for values such as total students, on-time students, absent students, approved absent requests, and pending requests. Because of this structure, the dashboard can show both summary numbers and visual graphs in one screen.

In simple flow, the user opens the dashboard page, Angular loads the component, the component asks data from the backend through services, and the returned data is shown in cards, graphs, and notification dropdown. This is the main front-end flow implemented in this thesis.
4.2	Dashboard Data and Feature Implementation
4.2.1	Backend Data Calling Flow
The dashboard page does not query the backend directly inside the HTML. Instead, it uses Angular services. In `dashboard-admin.component.ts`, the constructor injects `DashboardService` and `NotificationService`. These two services are responsible for sending HTTP requests to the backend API.

The first important flow happens in `ngOnInit()`. When the page is loaded, `ngOnInit()` calls `loadAttendanceAnalytics()` and `loadUnreadCount()`. This means the dashboard immediately requests attendance analytics data and unread notification count from the backend. In `dashboard.service.ts`, the function `getAttendanceAnalytics(period, year)` sends a `GET` request to `/api/dashboard/attendance-analytics?period=...&year=...`. It also reads the token from `localStorage` and puts it in the `Authorization` header. In `notification.service.ts`, the functions `getNotifications()`, `getUnreadCount()`, `markAsRead()`, and `markAllAsRead()` are used for notification-related requests.

Listing 4 1: Dashboard page initialization flow

```javascript
ngOnInit() {
  this.loadAttendanceAnalytics();
  this.loadUnreadCount();
}
```

This code shows the first step of the dashboard flow. After the page is opened, Angular runs `ngOnInit()`, and the component starts loading both attendance data and notification data.

Listing 4 2: Dashboard service call for attendance analytics

```javascript
getAttendanceAnalytics(period = 'daily', year = 2021): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(
    `${this.apiUrl}/attendance-analytics?period=${period}&year=${year}`,
    { headers }
  );
}
```

This code is taken from `dashboard.service.ts`. It shows that the front-end gets the token from `localStorage`, adds it into the request header, and then sends a `GET` request to the backend dashboard API.

Listing 4 3: Notification service call for unread count

```javascript
getUnreadCount(): Observable<any> {
  return this.http.get(`${this.apiUrl}/unread-count`, { headers: this.getAuthHeaders() });
}
```

This code is taken from `notification.service.ts`. It is used to get the number of unread notifications so that the front-end can show the badge on the notification bell.

Listing 4 4: Attendance data loading in the component

```javascript
private loadAttendanceAnalytics() {
  this.dashboardService.getAttendanceAnalytics(this.viewMode, this.selectedYear).subscribe({
    next: (response: any) => {
      const meta = response?.metaData;
      this.rawData = meta?.attendanceRates ?? [];
      this.passFailData = meta?.passFailByMajor ?? [];
      this.buildChart();
      this.buildBarChart();
    }
  });
}
```

This code shows the next step after the request is sent. When the backend returns the response, the component saves the returned data into variables and then calls the chart functions to display the result.

The display part is implemented in `dashboard-admin.component.html`. After the TypeScript file stores the returned values in component variables, Angular binding is used to show those values in the dashboard cards and notification section.

Listing 4 5: Displaying returned values in the dashboard HTML

```javascript
<span class="stat-number">{{ totalStudents }}</span>
<span class="stat-number">{{ presentCount }}</span>
<span class="stat-number">{{ absentCount }}</span>
<span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>

<button
  type="button"
  class="notification-item"
  *ngFor="let notification of notifications"
  [class.unread]="notification.status === 'unread'"
  (click)="markAsRead(notification)"
>
  <span class="notification-item-message">{{ getNotificationMessage(notification) }}</span>
</button>
```

This code shows how Angular displays backend data on the page. The values stored in `totalStudents`, `presentCount`, `absentCount`, and `unreadCount` are shown by interpolation using `{{ }}`. The notification list is shown with `*ngFor`, which repeats the HTML block for each notification item returned from the backend. Because of this, once the data is received in the component, the page updates automatically and shows the latest result to the user.

After the backend returns the response, the component stores the result in variables such as `rawData`, `passFailData`, `weeklyMajorData`, `totalStudents`, `presentCount`, `absentCount`, `approvedAbsentCount`, `pendingAbsentCount`, `notifications`, and `unreadCount`. These variables are later used in the HTML file. For example, `{{ totalStudents }}` is shown in the summary card, while `notifications` is shown in the notification dropdown. This approach is useful because the data logic stays in the TypeScript file and the HTML file only focuses on displaying the result.
4.2.2	Chart Implementation
The graph feature in the dashboard is implemented with Chart.js, which is imported in `dashboard-admin.component.ts` using `import { Chart } from 'chart.js/auto';`. In this page, three main charts are created, which are the line chart for attendance rate, the bar chart for pass and fail percentage by major, and the weekly attendance chart by major.

The line chart is created in the `buildChart()` function. First, the component gets the canvas element with `document.getElementById('attendanceChart')`. After that, it prepares labels and datasets from the backend data by using the `aggregateData()` function. Finally, it creates a new `Chart` object with type `line`. This chart changes based on the selected `viewMode`, which can be daily, weekly, or monthly. When the user changes the radio button, the `onViewChange()` function runs and loads the data again.

Listing 4 6: Line chart implementation for attendance analytics

```javascript
private buildChart() {
  if (this.chart) {
    this.chart.destroy();
    this.chart = null;
  }

  const canvas = document.getElementById('attendanceChart') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');
  if (!canvas) return;

  const gradient = ctx?.createLinearGradient(0, 0, 0, canvas.height || 300);
  if (gradient) {
    gradient.addColorStop(0, '#00B5E2');
    gradient.addColorStop(1, '#FFFFFF00');
  }

  const { labels, datasets } = this.aggregateData(gradient ?? '#00B5E2');

  this.chart = new Chart('attendanceChart', {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
```

This code shows the main implementation of the attendance line chart. The function first removes the old chart if it already exists. Next, it gets the canvas element, prepares a gradient color, and uses `aggregateData()` to build labels and datasets from backend data. After that, Chart.js renders the final line chart in the `attendanceChart` canvas.

The bar chart is created in the `buildBarChart()` function. This function reads `passFailData` from the backend response and maps the values into arrays such as major name, pass percentage, and fail percentage. Then it creates a bar chart in the `passFailChart` canvas. The weekly chart is created in the `buildWeeklyMajorChart()` function. This function filters the latest week from `weeklyMajorData`, sorts it by major, and then displays another bar chart in the `weeklyMajorChart` canvas.

Listing 4 7: Bar chart implementation for pass and fail percentage by major

```javascript
private buildBarChart() {
  if (this.barChart) {
    this.barChart.destroy();
    this.barChart = null;
  }

  if (!this.passFailData || this.passFailData.length === 0) {
    return;
  }

  const majors = this.passFailData.map((r) => r.major);
  const passPercentages = this.passFailData.map((r) => Number(r.pass_percentage));
  const failPercentages = this.passFailData.map((r) => Number(r.fail_percentage));

  this.barChart = new Chart('passFailChart', {
    type: 'bar',
    data: {
      labels: majors,
      datasets: [
        {
          label: 'Pass (≥75%)',
          data: passPercentages,
          backgroundColor: '#0baae8'
        },
        {
          label: 'Fail (<75%)',
          data: failPercentages,
          backgroundColor: '#ec1025'
        }
      ]
    }
  });
}
```

This code shows how the dashboard creates the pass and fail chart. The component reads `passFailData`, separates the data into major names, pass percentages, and fail percentages, and then sends these arrays into Chart.js to create a bar chart.

Listing 4 8: Weekly attendance chart implementation by major

```javascript
private buildWeeklyMajorChart() {
  if (this.weeklyMajorChart) {
    this.weeklyMajorChart.destroy();
    this.weeklyMajorChart = null;
  }

  if (!this.weeklyMajorData || this.weeklyMajorData.length === 0) {
    return;
  }

  const latestWeekDate = this.weeklyMajorData.reduce((latest: string, row: any) => {
    return new Date(row.date) > new Date(latest) ? row.date : latest;
  }, this.weeklyMajorData[0].date);

  const latestWeekRows = this.weeklyMajorData
    .filter((row: any) => row.date === latestWeekDate)
    .sort((a: any, b: any) => String(a.major).localeCompare(String(b.major)));

  const labels = latestWeekRows.map((row: any) => row.major);
  const data = latestWeekRows.map((row: any) => Number(row.rate));

  this.weeklyMajorChart = new Chart('weeklyMajorChart', {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#00B5E2'
      }]
    }
  });
}
```

This code shows the weekly chart flow. The component first finds the latest week from the backend data, filters the rows from that week, sorts them by major name, and then creates a bar chart to display the weekly attendance rate by major.

One important point in the implementation is that the old chart is destroyed before creating a new one. This can be seen in `buildChart()`, `buildBarChart()`, and `buildWeeklyMajorChart()`, where the existing chart instance is checked and destroyed first. This helps avoid duplicate chart rendering on the same canvas.
4.2.3	Notification Implementation
The notification feature is also implemented in the admin dashboard page. In the HTML file, there is a bell button, an unread count badge, and a dropdown list for notifications. When the bell button is clicked, the `toggleNotifications()` function is called. If the dropdown is opened, the component calls `loadNotifications()` and `loadUnreadCount()`.

Listing 4 9: Notification button and unread badge in the dashboard HTML

```html
<button type="button" class="notification-button" (click)="toggleNotifications()">
  <img src="/image_assets/bell.png" alt="Notifications" class="notification-bell-icon" />
  <span class="notification-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
</button>

<div class="notification-dropdown" *ngIf="notificationOpen">
  <div class="notification-state" *ngIf="loadingNotifications">Loading...</div>
  <div class="notification-state" *ngIf="!loadingNotifications && notifications.length === 0">No notifications</div>
</div>
```

This code shows the notification button in the HTML file. When the button is clicked, Angular calls `toggleNotifications()`. The unread badge is only shown when `unreadCount` is greater than zero, and the dropdown is only shown when `notificationOpen` is true.

Listing 4 10: Notification toggle flow in the component

```javascript
toggleNotifications() {
  this.notificationOpen = !this.notificationOpen;
  if (this.notificationOpen) {
    this.loadNotifications();
    this.loadUnreadCount();
  }
}
```

This code shows the action flow after the notification button is clicked. The component changes the open state of the dropdown. If the dropdown is opened, the component immediately requests the notification list and the unread count.

The function `loadNotifications()` uses `NotificationService.getNotifications()` to request the notification list from the backend. The response is saved into the `notifications` array. The function `loadUnreadCount()` uses `getUnreadCount()` to update the unread badge. In the dropdown, Angular uses `*ngFor` to loop through notification items and display them on the page.

Listing 4 11: Loading notifications from the backend

```javascript
loadNotifications() {
  this.loadingNotifications = true;
  this.notificationService.getNotifications().subscribe({
    next: (response) => {
      this.notifications = response?.metaData ?? [];
      this.loadingNotifications = false;
    },
    error: () => {
      this.notifications = [];
      this.loadingNotifications = false;
    }
  });
}
```

This code shows how the front-end receives notifications from the backend. Before the request is sent, `loadingNotifications` is set to true. After the response returns, the data is stored in the `notifications` array, and the loading state is turned off.

Listing 4 12: Loading unread notification count

```javascript
loadUnreadCount() {
  this.notificationService.getUnreadCount().subscribe({
    next: (response) => {
      this.unreadCount = Number(response?.metaData?.count ?? 0);
    },
    error: () => {
      this.unreadCount = 0;
    }
  });
}
```

This code is used to update the unread badge. The front-end sends a request to the unread count endpoint and then stores the returned value in `unreadCount`.

The page also allows the user to mark notifications as read. This is done by the `markAsRead(notification)` function and the `markAllNotificationsAsRead()` function. After a successful request, the front-end updates the notification status in the component data and decreases the unread count. Because of this, the notification area is not only for display, but also supports simple user interaction.
4.3	Dashboard Flow Summary
The overall dashboard flow in this thesis is simple. First, the user opens the dashboard page. Second, Angular loads `DashboardAdminComponent`. Third, the component calls the backend through `DashboardService` and `NotificationService`. Fourth, the returned data is saved in component variables. Fifth, the page uses these variables to show cards, graphs, and notifications in the HTML template. If the user changes graph mode or opens the notification area, the component sends another request and updates the display again.

This flow shows the main contribution of the thesis clearly. The backend already exists, but this thesis implements the front-end layer that receives backend data and turns it into a dashboard interface that is easier for users to read and use.
Chapter 5	
Findings and Conclusion
5.1	5.1 	Findings
CAMWA moves attendance management from a paper-based or semi-manual process into a structured web-based system. It supports the main attendance-related process, including authentication, role-based access control, academic data, module registration, attendance records, correction requests, exam eligibility, notifications, and protected asset access; the layered backend architecture also improves code organization because routes, middleware, controllers, services, and models each have separate responsibilities, where routes define API entry points, middleware handles authentication and authorization checks, controllers manage request and response flow, services contain business logic, and models handle database access, which makes the system easier to understand, maintain, and extend; the database structure further shows that naming and relationship consistency are important for reliable attendance processing because attendance data must be connected not only to a student and a general module but also to the correct module offering in a specific academic context, so the use of `intake_module_id` is an important design decision because it connects module registration, attendance records, attendance requests, and exam eligibility to the same intake module reference and reduces ambiguity when a module is related to different programs, intakes, semesters, courses, or lecturers; the authentication implementation provides a useful security foundation through hashed passwords, JWT access tokens, refresh tokens, protected routes, role checking, and logout support, but password reset, brute-force lockout, complete logout from all devices, and full Academic Coordinator role switching are not implemented in the current codebase; the attendance correction workflow also improves traceability because correction requests are stored separately from original attendance records with proposed status, reason, request status, and processing information, while notification and email functions support communication when requests are created or processed; reporting and asset access add practical value because exam eligibility can be calculated from attendance rates and exported to Excel files, and DigitalOcean Spaces-compatible signed URLs provide temporary access to protected file paths without exposing permanent public URLs, although AI-based face recognition remains future work rather than a current feature.

The front-end use Angular, provides the modular structure workflow with login, dashboards, module pages, request pages, account pages, and profile pages, using reusable components, and services so that views, repeated interface elements, and backend communication logic are separated; some parts of the front-end are connected to backend services, such as login through `AuthService`, dashboard analytics through `DashboardService`, and selected attendance, student, and course data through their related services, while Chart.js is used to display attendance analytics in dashboard pages and `localStorage` is used to store the token, role, and user ID after login; however, the front-end is still a prototype interface because several module and request pages use static sample data or partially implemented API calls, the route guard only checks whether a token exists in `localStorage`, detailed permission enforcement still depends on the backend, and the routing setup is not fully clean because the main route configuration is defined in `src/routes.ts` while `app-routing.module.ts` is mostly unused; these findings show that the front-end can demonstrate the intended user experience and role-based navigation flow, but it still needs stronger API integration, role-aware navigation, loading states, error handling, and front-end or end-to-end testing before the whole system can be considered ready for institutional use.
5.2	5.2 	Conclusion
This thesis studied and documented CAMWA as a web-based attendance management application that uses an Angular front-end, a Node.js and Express backend, and a PostgreSQL database managed through Sequelize ORM, and the project shows that a structured digital system can support the main academic attendance workflows through modular backend architecture, relational database models, JWT authentication, role-based access control, attendance processing, correction request handling, exam eligibility calculation, Excel processing, notification support, signed URL asset access, and front-end pages for login, dashboards, modules, requests, accounts, and profiles, while also showing that the current implementation is still an academic prototype because some front-end pages still use static data, the Academic Coordinator role-toggle workflow is incomplete, advanced authentication features such as password reset and brute-force lockout are missing, and formal testing, deployment preparation, and user acceptance validation have not been completed; therefore, CAMWA provides a useful foundation for digital attendance management and can become more suitable for institutional use after further security improvements, front-end integration, testing, and deployment work.

Finally, the system could be integrated with the VGU SIS. This integration would allow CAMWA to automatically retrieve module schedules, student enrollment data, and student image references. It would reduce manual work for Faculty Assistants and help keep academic data consistent between systems.
5.3	5.3   Future Work
Future work should first focus on completing front-end integration. Static sample data should be replaced with live backend responses, and role-based navigation should be improved so that each user sees only the pages relevant to their role. Front-end error handling, loading states, and end-to-end testing should also be added for important workflows such as login, dashboard viewing, module access, and attendance request handling. The Academic Coordinator workflow should be completed if the role is required by the institution. This includes implementing a clear role-switching service, defining how AC and lecturer responsibilities are separated, and ensuring that tokens and route permissions are updated correctly after a role change.

Additional future improvements can include real-time notifications using WebSocket, a mobile application for students and staff, integration with the VGU Student Information System, and AI-based face recognition for attendance support. AI-based features should be developed carefully because student images and identity data are sensitive and require strong privacy and security controls.
