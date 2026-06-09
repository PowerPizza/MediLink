This document is about how to run the project at your local system intended for **developers only**.

# Requirements
* Python must be installed on system, run the following command in cmd to confirm:
```
python --version
```
* pip must be configured on path, run the following command in cmd to confirm:
```
pip --version
```
* postgres sql + pgAdmin must be installed, press window key and search pgAdmin and try opening it, if fails to open then install properly.

# Database Setup
* Open pgAdmin
* Right click `Databases` dropdown from left-panel.
* Select `create > database...`
* In first field (i.e.: database) enter `Medilink` (make sure to type exact name)
* Click **save**
* Now expand `Login/Group Roles` from left-panel.
* Right click `postgres` and click `properties`.
* Go into `defination` tab.
* In password field type `admin` and click `save`

# Basic Steps
* Download zip of this repository or clone into your system using git-cli.
* Extract the zip (if you have downloaded zip file).
* Open the extracted folder.

# Backend
* Open backend folder inside that extracted folder.
* Double click `auto-run` or `auto-run.cmd` file.
* Once application started try visiting `127.0.0.1:8084/api/v1` you will see something like `{success: true}` means backend is now running.

# Frontend
* Download the apk from EAS dashboard/builds.
* Install it on your phone.
