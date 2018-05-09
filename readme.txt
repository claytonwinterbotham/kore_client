KORE Timeslip Instructions:

Overview:

This application is designed to provide KORE employees with a simple,
easy-to-use interface to enter their timeslips for the work they do.
We've created APIs using a serverless ASP.NET Core application that
are available through AWS using API Gateway and AWS Lambda. The database
is provided by AWS RDS service. We've also created a front-end app
to consume the APIs using Angular and Bootstrap 4. 

Instructions:

To launch a local instance of the Angular application:

1. Download the .zip file from the Angular GitHub repository (https://github.com/claytonwinterbotham/kore_client).
2. Extract the files to your directory of choice.
3. Use command prompt to access the directory with the relevant 
angular files (with the package.json file). 
4. If you wish to consume the APIs from a local instance of the Dotnet Core app, you must first change the urls in each data service
found in the 'services' folder to a 'localhost:<your-port>'. Currently, they are set to communicate with the API Gateway endpoints.
4. In the same directory where the package.json file resides, run this command >npm install 
5. In the same directory where the package.json file resides, run this command >ng serve
6. Use a browser to navigate to localhost:4200

To launch a local instance of the Dotnet Core application:

1. Download the .zip file from the ServerlessApp Github repository. (https://github.com/wokaerhenshen/Kore_ServerlessApp)
2. Extract the files to your directory of choice.
3. To use a local sqlite database, in Startup.cs, in the ConfigureServices method, change 
from:
"options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));"
to:
"options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));"
4. Delete the migrations folder and app.db file.
5. Create a new app.db file.
6. In the package manager console in Visual Studio, run >add-migration initialCreate
7. In the package manager console in Visual Studio, run >update-database
3. Run the project from Visual Studio.

To use the application hosted on Microsoft Azure, follow this link:
	
https://koretimeslip.azurewebsites.net

GitHub Links:

Dotnet core application:  https://github.com/wokaerhenshen/Kore_ServerlessApp
Angular applications:	  https://github.com/claytonwinterbotham/kore_client

API Documentation:

To access the documentation through swagger UI, you must first run the dotnet project locally.

1. Follow instructions to run the Dotnet Core app.
4. Using a browser, navigate to <localhost>:<random-port>/swagger 

Usage Instructions:

1. LOGIN - Use the following sample credentials (or create your own by registering):

email: 	  bob@home.com || sally@home.com
password: password

2. ADD TIMESLIP 
	a. Use the calendar view to see your existing timeslips by Month, Week, or Day
	b. From the Day view, you may add individual timeslips using the form on the left.
	c. From the Day view, you may also select a "Custom Day" (if created) to add multiple
	   timeslips at once from this custom template.
3. ADD CUSTOM DAY - CREATE 
	a. Enter the Name and Description of your new Custom Day.
	b. You will be allowed to edit and finally create that custom day from edit page.
4. ADD CUSTOM DAY - EDIT
	a. Add "timeslip templates" to the Custom Day by using the form on the left. 
	(Please note: this will NOT create actual timeslips until it is used on the ADD TIMESLIP page!)
	b. Click CONFIRM to create the custom day.
5. CREATE PROJECT
	a. Fill out the form to create a new project.
6. CREATE WBI
	a. Fill out the form to create a new WBI.
	
Thanks, and we hope you enjoy Timeslip API!

Kevin Kline, Jan Lingat, Karl Xu, and Clayton Winterbotham



	
