# Overview

This project uses Django as Backend and React as Frontend, the details on how to setup both sides are described below.

## Setup Backend

### Create a Virtual Machine
In the Backend folder, you can run:

 `python -m venv your-venv`

### Activate the Virtual Machine

Windows

Go to `cd your-venv\scripts\` and run `.\activate`

Linux

Go to `cd your venv` and run `source bin\activate`

### Install the dependencies

In Backend folder, run the following:

`pip install -r requirements.txt`

### Run Scripts

In Backend folder, run the following:

`python manage.py create-super-user`

`python manage.py makemigrations`

`python manage.py migrate`

`python manage.py runserver`


### Include data

Access `http://localhost:8000/admin`, provide the credentials and add some data. The best order to include data is:

* Program
* User
* ProgramApplication


## Setup Frontend 

In FrontEnd folder run the following:

`npm install`

`npm start`

Go to `http://localhost:3000`

Select the desired program