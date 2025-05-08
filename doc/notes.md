Web Application Starter Pack
============================

# Environment

- VS Code
- VS Code extensions (C#/C# Dev Kit, JavaScript Debugger, GitHub Copilot/Chat, Azure Resources/App Service/Container Apps, Docker)
- .NET SDK
- Node.js
- Docker Desktop

## Creating a new .NET Core Web API project

Even numbered .NET versions have LTS (3 years of support).

### Command line

dotnet new webapi -n WebApplication1
dotnet run

### Visual Studio Code

VS Code -> Explorer (top left) -> Create .NET Project -> ASP.NET Core Web API

### Adding unit tests

- Open the command palette (hit F1), then .NET: New Project -> xUnit Test Project
- In VS Code terminal, cd into the src folder and run

dotnet add <test project's csproj> reference <main project's csproj>

- To run the test, cd into the test directory, build the project and run it

dotnet build
dotnet test bin/Debug/net8.0/<test project's name>.dll --logger "trx;logfilename=Results.xml"

## Creating a new React.JS project

### Creating and running the project

npx create-react-app react-app-1

If you get an error message saying that C:\Users\<USER>\AppData\Roaming\npm is missing, then create that folder.

cd react-app-1
npm install
npm start

To stop the app on Mac:
- Ctrl + c (not Cmd + c)

### Deploying the project

To deploy the project to a web server:
- npm run build
- An optimized production build will be created in the build folder

### Troubleshooting

If something is not working but it should:
- delete package-lock.json, node_modules
- npm install

# Azure

It's a good practice to prefix Azure resources. E.g. "rg-" for resource groups or "db-" for databases.

The Azure CLI can be run from within the Azure Portal (click the Cloud Shell icon on the menubar).

## Virtual Machine

Creating a web server:
- From availability options, select no infrastructure redundancy required
- Select standard for security type
- For OS, select Windows Server 2022 Datacenter - x64 Gen2
- Select Standard_B2s - 2 vcpus, 4 GiB memory as size
- Select http, https and ssh for inbound ports in addition to rdp which is already selected by default
- On the disks tab, select standard ssd as a locally redundant storage
- Make sure the delete with vm checkbox is checked
- On the networking tab, make sure that allow selected ports is selected as public inbound ports and select http, https, ssh and rdp as inbound ports
- Make sure the delete public ip and nic when vm is deleted checkbox is checked
- Shut down the server when you don't need it to save money

Configuring the server:
- When the server starts up, allow it to be discoverable by other devices on the same network (it's the recommended setting for home/work networks)
- Do a Windows update and restart if necessary: Start -> Settings -> Update & Security -> Check for updates
- To allow network sharing, go to the server on Azure Portal -> Networking -> Network Settings and create a new inbound port rule for destination TCP port 445. (Name the rule e.g. NetworkShare.)
- Share a folder on the server and connect to it (from Finder Go -> Connect to server -> smb://<IP address> -> Connect then navigate to the folder, hover the mouse over the folder name in the upper-left part and drag and drop it to Locations on the left to have it easily accessible)
- (If the shared folder is not accessible on Windows, check the firewall settings.)

Configuring IIS:
- To add IIS: Start -> Server Manager -> Manage -> Add roles and features -> Nexts -> Add Web Server (IIS) -> Nexts -> On Select Role Services add Web Server/Application Development/ASP.NET 4.8 -> Next -> Install -> Close
- Verify the installation by opening localhost on the server and visiting the IP address of the server in the browser from another machine
- Install the .NET Core Hosting Bundle
- Create an IISApplications folder on the C drive for the apps

Publishing a web api to IIS:
- Publish your app (web api) and copy it over the server into the IISApplications folder
- Right click the default website and add a new application (a virtual directory won't do)

Publishing a react app to IIS:
- Add "homepage": "." to the root of package.json, otherwise the resources might not be found on the server if the app is deployed as an application under a website
- To create a production build, run: npm run build
- Copy the build folder into the IISApplications folder and rename it to the name of the application
- Right click the default website and add a new application
- If IIS is loading some cached version of some files instead of what is actually in the IISApplication folder, restarting the server will surely solve it
- If you get a 404 error upon loading the app, check the app pool and if the default app pool is used, change it to an appropriate version of .NET (e.g. .NET 4.5) or .NET Core

## SQL Server

Creating an SQL database:
- Under Compute + storage click Configure database and make sure that under the vCore model, General Purpose (Most budget friendly) is selected, then make sure that the Serverless option is selected. Make sure that the Enable auto-pause checkbox is checked and set the auto-pause delay to 15 mins. Set the maximum size of the database to 4 GB. Make sure that the database zone redundancy is set to No
- To avoid legal troubles concerning data residency, select Locally-redundant backup storage
- Go to the database and click Set server firewall. Under the Public access tab, select Selected networks and under Firewall rules, click Add your client IPv4 address. Optionally, change the name of the rule to the computer name you're connecting to the database. Also, add the IP address of the web server. Click Save
- Install the Microsoft.Data.SqlClient (it has replaced System.Data.SqlClient) NuGet package in the backend
- Connect to the database from VS Code with the SQL Server (mssql) extension. Once installed, click on the DB tab on the left and add your connection
- You can also log in to your database (and query and update data) via the Azure Portal. Go to the DB and click Query Editor
- The connection string to the DB is under Settings -> Connection Strings

## Storage Account

- It's used to store images or any large binary data
- Like a database, it has a connection string
- Images can be uploaded using the Azure Portal (Storage Browser) and then the urls can be stored in a SQL databse
- To upload images from your app, use the Azure.Storage.Blobs and the Microsoft.Extensions.Azure packages

## Azure Web App

Creating an Azure Web App for the web api:
- (Make sure that Try a unique hostname is set to off)
- Choose the Free F1 (Shared infrastructure) Pricing plan
- On the Monitor + secure tab, disable Application Insights
- Go to the resource and click Browse to see what is there by default

Deploying the web api:
- In the terminal within VS Code, navigate to the backend's folder and build the project: dotnet publish -c Release -o ./bin/Publish <backend's csproj>
- Click on the Azure icon and sign in to your Azure account. Then under resources, you should be able to see your subscription and the resources under that subscription
- Right click the folder in the bin folder that contains the output of your build and click Deploy to WebApp. When prompted, select your WebApp you created in Azure then click Deploy

## Azure Static Web App

Creating an Azure Static Web App for the React website:
- On the Azure Portal, click Create a resource and under the Web tab click Create Static Web App
- Select Free for the plan type, GitHub as the source. Log in with your GitHub account and specify the repository and the branch where your app is located. As Build presets, choose Custom. The App location and the Output location should point to the folder where your build output is (e.g. /build/bin/WebApp). Under the Deployment configuration tab, select GitHub
- If you go to the resource once it's created, you'll see a notification saying "Thank you for using Azure Static Web Apps! We have not received any content for your site yet." Click on it and it will take you over to GitHub to the Actions tab of your repository. You'll see there the Azure workflow being run. When the workflow has finished successfully, you'll see a green tick next to it

## Azure Container App

Supports scale based on traffic. If a container is not being used, it will scale down to zero.

Azure Container Instance: scale, load-balancing or certificates aren't provided.

### .NET Web API (backend)

Creating an Azure Container Registry:
- On the Azure Portal create a new container registry with a Basic pricing plan
- Go to the resource and under Settings -> Access keys, enable the Admin user

Creating a Docker image:
- Install Docker Desktop and go with the recommended settings (this will require a password). You don't need to create an account. (Allowing Docker to discover devices on your local network may not be necessary.)
- In VS Code, hit F1 then Docker: Add Docker Files to Workspace -> Select the .NET project -> .NET: ASP.NET Core -> Linux -> Leave the port number empty -> Click no when asked whether to include optional Docker Compose files -> If asked whether to overwrite already existing Docker launch configurations, click overwrite
- Start Docker Desktop and update it if necessary
- In VS Code Terminal, cd into the root directory of the repo and run

docker build --no-cache -f src/<backend's folder>/Dockerfile -t ca-backend:latest --platform linux/amd64 .

- You can list the content of a directory by inserting RUN dir . at the appropriate location in the docker file
- You can get the directory you're in by echo %cd%
- You can delete everything from Docker including the caches:

docker system prune -a -f

Adding the Docker image to the container registry:
- On the Docker tab in VS Code, click Connect Registry (plug icon) and select Azure Container Registry. Then click on Azure in the Registries panel and sign in. Then you should be able to see the container registry you created above
- On the Images panel, right click the image and click Push. Select your container registry. When prompted, allow VS Code to access data from other apps
- (Your Docker image should appear on the Registries panel. You can right click the image and click Deploy Image to Azure Container Apps.)

Creating a Container App:
- Create a Container App
- On the Container tab, select the registry, the image and the image tag that you created above
- For development stack select .NET
- For CPU and memory, select 0.25 CPU cores and 0.5 GB memory
- On the Ingress tab, enable Ingress and select Accepting traffic from anywhere

### React website (frontend)

Building the React app:
- In the terminal cd into the frontend's folder and build it: npm install. Then create an optimized production build: npm run build

Containerizing the app:
- Add a new file to the build folder named Dockerfile and add the following content to it:

FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

- Start Docker Desktop, then cd into the build folder and build the image:

docker build --no-cache -t ca-frontend:latest --platform linux/amd64 .

- (Building it without specifying the platform, will cause an error in Azure while creating the container app)
- When the build is complete, check if it's working in Docker Desktop. Assign port 80 to the host port under optional settings, name the container frontend and run it. Open localhost in a browser to see if it's working
- You can use ls -a in the yml file to see what's in a directory

Deploying the app in an Azure Container App:
- On the Docker tab on the images panel right click the image you created above and click Push
- Create a Container App from the image in Azure

## Azure Function

- It's like a Container App but it's optimized for event-driven applications
- It's very cost-efficient
- Triggers (e.g. HTTP requests or timers) srart the function and they may have input data

## Network

Zero trust architecture is a security strategy. The principle is that users and devices should not be trusted by default, even if they are connected to a corporate network. It ensures least privilege access to only explicitly-authorized resources. The traditional approach by trusting users and devices within a network is commonly not sufficient in the complex environment of a corporate network. The zero trust approach moves from trust-by-default to trust-by-exception.

Microsoft is making Security Defaults (preconfigured security settings) available to everyone to ensure that all organizations have at least a basic level of security enabled at no extra cost. 99.9% of common identity-related attacks are stopped by using multifactor authentication.

### Admin

To manage users, go to Microsoft Entra ID -> Users

To assign roles to a subscription, go to the subscription and under Access Control (IAM) -> Role assignments you can list roles assigned to users or service principals.

# Git

For pointing and clicking instead of typing:
- Mac: Github Desktop
- (Win: Tortoise Git)

Semantic versioning:
- Major: Backward incompatible changes
- Minor: New features but backwards compatible
- Patch: Backwards compatible bug fixes only

A branch can be squashed, merged and pushed back to the original branch from GitHub Desktop (switch over to the original branch, then Branch -> Squash and Merge into Current Branch, select the branch you want to merge back and then push to origin).

The main branch can be protected by adding rulesets (e.g. deletions can be restricted, an approved PR can be mandatory for merging or force pushes can be blocked): go on GitHub -> Settings -> Rules -> Rulesets

## CI/CD with GitHub actions

- On the Actions tab of your repository on GitHub, click New workflow and set up a workflow. This will add a new yml file under .github/workflows folder. Add the workflow and then click Commit changes
- For GitHub to be able to deploy to Azure, you'll need to provide GitHub with your login credentials, which you can do on the Settings tab under Secrets and variables -> Actions
- (If your repository is public, you can also add environment secrets)
- Click New repository secret and add CONTAINER_REGISTRY_USERNAME. On the Azure Portal go to your container registry and under Settings -> Access keys copy the Username and paste it on GitHub
- In a simliar way, create CONTAINER_REGISTRY_PASSWORD
- Also, create AZURE_APP_ID, AZURE_PASSWORD, and AZURE_TENANT but to do that Azure CLI needs to be installed. To get Azure CLI on Mac, you first need to install homebrew. When homebrew is installed, open a Terminal and run

brew update && brew install azure-cli

- If you get a "command not found brew" error, open a Terminal and run

cd /opt/homebrew/bin/
PATH=$PATH:/opt/homebrew/bin
echo export PATH=$PATH:/opt/homebrew/bin >> ~/.zshrc

- To update Azure CLI: az upgrade
- To log in to Azure CLI: az login
- To create a service principal: az ad sp create-for-rbac --name "<a unique name that hasn't been used before>" --role contributor --scopes /subscriptions/<your Azure subscription id (you can find it on the Azure Portal under your subscription)>
- Save the appId, the password and the tenant as GitHub secrets to be able to log in to Azure from the yml file (az login --service-principal -u <appId> -p <password> --tenant <tenant>)
- The Azure CLI can also be started from the Azure Portal (click the cloud shell icon in the upper right corner)
- You can manage the created service principals on the Azure Portal under Microsoft Entra ID -> App registrations -> All applications
- To go back to a previous version, go to the Actions tab on GitHub, select the last successful workflow and click Re-run all jobs

# Backend development

## C#

Cmd + K, C: comments selected lines
Cmd + K, U: uncomments selected lines

Concatenate strings with string interpolation (it's a shorthand for string.Format):

string str1 = "a";
string str2 = "b";

string str3 = $"{str1} and {str2}";

Use
- GitHub Copilot
- Implicitly typed local variables (var)
- Linq in conjunction with for loops to query lists
- File-scoped namespaces
- Object initializers
- Null conditional operator (?., ?[])
- Null coalescing operator (??)
- (Primary constructors)

Null-forgiving operator (!): You're telling the compiler "Trust me, this isn't null!"

Property initialization:

public int Count { get; set; } = 0;

With the dynamic keyword, the compiler will skip type checking for the variable at compile time. Any operations on the object are resolved dynamically.

## ASP.NET Core

Middleware components can be used to write common functionality that executes for every request. When a component finished processing a request, it passes it on to the next component in the pipeline.

Dependeny Injection (DI) is a design pattern used to manage the creation and lifetime of objects (dependencies) and inject them into classes that need them. DI helps with testability because mock dependencies can be injected during testing.

Using asynchronous methods is a best practice in production-grade modern ASP.NET Core applications, especially when interacting with databases. They don't block the thread and they scale better because they allow the server to handle more requests simultaneously. This improves responsiveness.

DTOs (Data Transfer Object) only contain the information needed for specific operations (e.g. there can be a User model that contains all user information and a UserDto class that only contains the user name and the password).

The curl command can be used to call an endpoint. The body of the request can be saved in a json file (adding the verbose option will return the http response status too):

curl -v -X <request method e.g. POST> <endpoint url> -H "Content-Type: application/json" --data @<relative path to json file>

curl -v -X GET "<url of endpoint that requires authentication>" -H "Authorization: Bearer <token>"

CORS restrictions only work in browsers. They don't work with curl, Postman or similar tools.

Secure cookies are only sent over HTTPS, never over HTTP (except on localhost).

A cookie with the HttpOnly attribute can't be accessed by JavaScript. It can only be accessed when reaching the server. Authentication cookies should be HTTP-only.

When the SameSite attribute is set to strict, the browser will only send the cookie in response to requests originating from the cookie's origin site.

To use a self-signed https certificate: dotnet dev-certs https --trust

## Entity Framework Core

Nuget packages:
- (Microsoft.EntityFrameworkCore)
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Design
- (Microsoft.EntityFrameworkCore.Tools)

To add a package, cd into the project's directory and run: dotnet add package <package name>

Connection strings should be stored safely. Either in an environment variable or with .NET Sectets Manager or in an Azure Vault.

Eager loading vs. lazy loading: to enable lazy loading, install the Microsoft.EntityFrameworkCore.Proxies. But lazy loading might lead to performance problems if not used carefully (N+1 query problem).

When EF Core queries a database, it stores a snapshot of the result set in memory. Any changes to the entities are made against that snapshot and it's written back to the database only later. To speed up read only queries, you can skip the snapshot and conserve system resources by adding the AsNoTracking() method to the query.

LINQ queries are generally safe from SQL injection because they are translated into parameterized SQL queries by Entity Framework.

### Creating a new database from the code

- Add the models and the database context to your project
- Install the .NET EF tool:

dotnet tool install -g dotnet-ef

- Create a migration: dotnet ef migrations add <name of migration>
- Check the migration files if they are correct then run the migration:

dotnet ef database update

- If you change the data model, change the model files then create and run another migration
- Fluent API use extension methods to chain methods together along with lamda expressions to specify the query. The same can be achieved with Linq syntax

### Scaffolding code from an existing database

- Build the project, then run:

dotnet ef dbcontext scaffold "<connection string>" Microsoft.EntityFrameworkCore.SqlServer --context-dir Data --output-dir Models --data-annotations

- If the database model changes, you can either manually update the entity model or you can rescaffold the entity models

### Different DB providers

To add an additional (e.g. Sqlite) database context to the project:
- Create the database and put data in it (e.g. with DB Browser for Sqlite)
- The changes made in DB Browser for Sqlite need to be saved (it doesn't save changes automatically)
- Install the Microsoft.EntityFrameworkCore.Sqlite package
- Instead of using SqlServer use Sqlite:

services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlite(connStr));

## .NET Secrets Manager

To add a connection string to .NET Secrets Manager:

dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:<name of connection string>" "<connection string>"

To add a secret:

dotnet user-secrets set "<secret name>" "<secret value>"

The secrets are stored in ~/.microsoft/usersecrets/<user_secrets_id>/secrets.json

The UserSecretsId is added to the .csproj file.

To get the connection string in Program.cs:

builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SqlServer")));

To list user secrets: dotnet user-secrets list

Delete a secret: dotnet user-secrets remove "<secret name>"

To delete all user secrets: dotnet user-secrets clear

## Authentication

Microsost Entra:
- It delivers unified zerto-trust user access
- Usually a Microsoft account is needed but it also works with external identity providers like Google, Facebook etc. Custom email/password authentication can also be used

JWT (Json Web Token):
- A lightweight authentication mechanism
- The client sends a token in the Authorization header with each request
- It's usually sufficient if no third party providers are needed (Google/Facebook etc.)
- To use it, install the Microsoft.AspNetCore.Authentication.JwtBearer package
- The jwt.io website can be used to decode a token (e.g. copied over from the client side) and verify that the issuer and the audience properties are set correctly

API key authentication:
- A machine-to-machine authentication mechanism
- Usually used to secure internal APIs

## Postman

To make a post request, add Content-Type = application/json to the header and a json object to the body of the request.

To make an authenticated request, select Bearer Token on the Authorization tab, then copy and paste the token.

## Tests

If the test cases are not being shown on the testing tab in VS Code then clean and the projects, close VS Code, run the cleanup scripts then open VS Code again and rubuild the projects. If that doesn't solve the issue, restarting the machine will.

### Unit Testing

Required packages:
- Microsoft.EntityFrameworkCore.InMemory (to simulate databases)

Unit tests are for testing individual components in isolation (e.g. methods).

A common pattern to name test cases: <MethodName>_<ExpectedResult>_<Condition>

To debug tests, go on the Testing tab and click the play icon with the bug next to the test.

Test for:
- Happy paths: the expected behavior
- Edge cases: invalid inputs, missing data etc.
- Error handling: proper error responses

### Integration Testing

Required packages:
- Microsoft.AspNetCore.Mvc.Testing (if there is a version error, use the --version switch to get the version that matches the .Net version of the project)

To test the middleware pipeline, integration tests are needed. As integration tests take longer to run, exhaustive testing of functionality is not needed. Usually, testing the CRUD operations is sufficient to make sure that different components (e.g. database, middleware) can work together.

The following declaration is required in the Program.cs file, otherwise integration tests will not work:

public partial class Program { }

# Frontend development

- If there's a CORS error and there shouldn't be any, cleaning the project, closing and reopening the workspace and VS Code in addition to deleting everything unnecessary from both the frontend and the backend and rebuilding and restarting them might solve the issue
- Vulnerabilites found by npm install may be fixed by running npm audit --force but it may break the project
- To stop search engines from indexing a page, add: <meta name="robots" content="noindex, nofollow" />
- Authentication tokens should not be stored in the browser's local storage because it's vulnerable to cross-site scripting (XSS) attacks. If an attacker injects malicious JavaSctipt into your app, they can access the token. Cookies can be marked as HttpOnly and Secure making them inaccessible to Javascript and safer against XSS. But cookies are vulnerable to cross-site request forgery (CSRF) unless CSRF protection is implemented
- To prevent XSS, user input (e.g. in forms or query parameters) should be sanitized. Libraries like DOMPurify can be used
- If no cookies are used by a website, a cookie consent form might not be needed. But a GDPR-compliant privacy policy is still a must
- A good (and free) favicon generator: favicon.io/favicon-generator
- On the Application tab of the browser's Developer Tools, the cookies and the content of the local storage can be checked
- On the Network tab of the browser's Developer Tools, all the http communication between the frontend and the backend can be checked

## HTML

Outlines don't take up space in the DOM as opposed to borders do, which do. To prevent movements of elements, use outlines instead of borders.

## JavaScript

Use:
- Template literals to build strings (that stange quotation-mark-like character is the backtick): `Some text ${someVariable}`

Different ways to define functions:

function normalFunction() {
    alert("normalFunction");
}

var functionAssignedToAVariable = function () {
    alert("functionAssignedToAVariable");
};

var arrowFunction = () => alert("arrowFunction");

async function asyncFunction() {
    alert("asyncFunction");
};

normalFunction();
functionAssignedToAVariable();
arrowFunction();
await asyncFunction();

## React

- React apps are made of components. A component is a piece of the UI (user interface) that has its own logic and appearance. React component names must always start with a capital letter, while HTML tags must be lowercase. The export default keywords specify the main component in the file
- The markup syntax you’ve seen above is called JSX. It is optional, but most React projects use it. JSX syntax can be used anywhere in the component - not just in the return() statement
- A CSS class can be specified with the className attribute
- JavaScript can be used with curly braces. Within the value of an html element or in an attribute
- Functions starting with use are called Hooks. useState is a built-in Hook. Hooks can be called only at the top of components
- To use routing: npm install react-router-dom

A quick demo of some basic React functionality:

function DemoButton() {
    const [count, setCount] = useState(1);

    function onClick() {
        alert(`Clicked ${count} time(s)`);
        setCount(count + 1);
    }

    return (
        <button className="one" onClick={onClick}>Demo button</button>
    );
}

Two ways to display data in a table (one with hard-coded column names, one without them):

var table = [
    { Col1: "Val11", Col2: "Val12" },
    { Col1: "Val21", Col2: "Val22" }
];

var DemoTable1 = () => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Col1</th>
                    <th>Col2</th>
                </tr>
            </thead>
            <tbody>
                {table.map((row, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{row.Col1}</td>
                        <td>{row.Col2}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

var DemoTable2 = () => {
    var colNames = table.length > 0 ? Object.keys(table[0]) : [];

    return (
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    {colNames.map((colName, index) => (
                        <th key={index}>{colName}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {table.map((row, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {colNames.map((colName, colIndex) => (
                            <td key={colIndex}>{row[colName]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

<DemoTable1 />
<DemoTable2 />

# AI tools

ChatGPT and other AI tools may leave watermarks in the generated texts (e.g. some kinds of hard to see white spaces).

## Prompt Engineering

Two types of LLMs:
- Base LLM (predicts next word)
- Instruction Tuned LLM

Use clear and specific instructions:
- Use delimiters (e.g. triple dashes)
- Ask for structured output

Give the model time to think:
- If the model is making reasoning errors by rushing to an incorrect conclusion, reframe the query to request a chain of relevant reasoning before the model provides its final answer. If you give a model a task that's too complex for it to do in a short amount of time, or in a small number of words, it may make up a guess, which is likely to be incorrect. You can ask the model to think longer about the problem, which means spending more computational effort on the task
- You can try to specify the steps to complete a task
- You can instruct the model to work out its own solution before rushing to a conclusion because sometimes the model just skims the text and gives an incorrect answer

Hallucinations:
- The model makes statements that sound plausible but are actually not true
- To reduce hallucinations, ask the model to first find the relevant information and then answer the question based on relevant information

Make your prompts iteratively better.

You can use LLMs to:
- Summarize text or expand text
- Do sentiment analysis (you can either ask the model to do it explicitly, or you can ask it to identify emotions that the writer of the text is expressing)
- Spell check or grammar check
- Translate text
- Transform the tone of a text
- Transform the formatting of a text (e.g. json to html)
- Build chatbots

Temperature allows to change the variety of the responses. The higher the temperature, the more randomness there will be in the responses

## Cursor

# Misc

## Firefox

To get the path to the cache:
- Type about:cache in the address bar
- Hit enter

## Mac

To list access privileges for all files in a directory: ls -la

To give a file execute privilege: chmod +x <filename>

To run a .command file downloaded from the Internet, double click it then Settings -> Privacy and Security -> Open Anyway

To list hidden files with Finder: Cmd + Shift + .

The Windows App can be used to rdp into a Windows VM.

To find out the ip address of a web server: nslookup <url>

Terminal history can be deleted by deleting the contents of the ~/.zsh_history file or contents of the ~/.zsh_sessions directory.

If function keys don't work when debugging:
- Settings -> Desktop & Dock -> Shortcuts -> Set Show Desktop to -
