# DS2023_30641_Holuta_Maria-Antonia_Assignment_1

## For running with docker in docker branch
- docker build -t react-frontend in Frontend folder
- docker build -t spring-backend-1 in Backend1 folder
- docker build -t spring-backend-2 in Backend2 folder
- docker-compose up in root folder


## Step 1: Database Configuration
### Installing Databases
- Install PostgreSQL and MySQL on your system.

### Database Creation
#### For PostgreSQL:
```sql
CREATE DATABASE postgres
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
COMMENT ON DATABASE postgres
    IS 'default administrative connection database';
```

#### For MySQL:
```sql
CREATE DATABASE IF NOT EXISTS Energy_Management;
USE Energy_Management;
```

## Step 2: User Backend
Setting Up User Backend
Open the user backend (Backend1) in another IntelliJ IDEA project.
Configure the data source of the MySQL database in application.properties with the database name and password.
Run the Spring Boot application for the user backend. It will create necessary tables in the MySQL database.

## Step 3: Device Backend
Setting Up Device Backend
Open the device backend (Backend2) in IntelliJ IDEA.
Configure the data source of the PostgreSQL database in application.properties with the database name and password.
Run the Spring Boot application for the device backend. It will create necessary tables in the PostgreSQL database.

## Step 4: Frontend
Running the Frontend
Open the frontend in a separate terminal window or a web IDE such as Visual Studio Code.
Navigate to the frontend directory using the cd frontend command.
Install the frontend dependencies with npm install.
After installation, run the frontend with npm start.


## Step 5: Accessing the Application
From the website, select "Login" from the navigation menu to authenticate.
Administrators can access "Users," "Add User," "Device," or "Add Device" from the navigation menu, while clients can only access "My Devices."
The user assigned to devices can be viewed in "Devices" under "User Assigned."
To update, use the pencil icon, to delete, use the trash can icon. To add/remove devices to users, go to "Users" -> "Manage Devices" -> "Add/Remove"


## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/holuta.maria/ds2023_30641_holuta_maria-antonia_assignment_1.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.com/holuta.maria/ds2023_30641_holuta_maria-antonia_assignment_1/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

