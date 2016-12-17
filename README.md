# react-frontend

Requires Node v6

## Project Structure:
```
app/
|
|── assets/  static assets for development; ex: photos for cubemap, .stl files for testing 3D stuff, etc
|   |── fonts/
|   |   └── font.tff
|   |── images/
|   |   └── thing.jpg
|   |── geometry/
|   |   └── testMask.stl
|
|── actions/
|   |── action.js
|   └── epic.js
|
|── reducers/
|   └── reducer.js
|    
|── services/ no UI, app-specific, not-shareable, just actions/data-fetching; ex: auth
|   |── ServiceA/
|   |   |── action
|   |   |── index
|   |   |── reducer
|   |   └── (epic?)
|
|── styles/
|   |── base/  project-wide styling
|   |   └── variables.scss
|   |── util/  any utility methods
|   |   └── flexHelper.scss
|   |── vendor/  external files or imports
|   |   └── grommet.scss
|   |── views/  same naming as app category
|   |   |── elements/
|   |   |── modules/
|   |   |── partials/
|   |   └── viewName.scss
|   └── main.scss (imports everything from above)
|
|── util/  helpers, polyfills, convenience methods, single JS files
|   └── requestAnimationFrame.js
|
|── views/  "dumb" components that are routed to; 
|   |── elements/ shareable, self-contained, "meta-components"; ex: textinput, table
|   |   └── ElementX
|   |── modules/
|   |   |── ModuleX/
|   |   |   |── Module [ includes selector: https://github.com/reactjs/reselect/issues/97 ]
|   |   |   |── ModuleComponent
|   |   |   └── SubModules/ [possible]
|   |── partials/  "dumb" components, either merely displays (say, images) or a composition of modules+elements
|   |   |── PartialX/
|   |   |   └──PartialX
|   └── ViewX
```

## Sourcemaps
Enable advanced sourcemaps by passing the flag --env.sourcemap <sourcemap> when running your script. Possible options for sourcemaps:
* eval (not very useful)
* cheap-eval-source-map (a little useful)
* cheap-source-map
* cheap-module-eval-source-map (semi-useful)
* cheap-module-source-map
* eval-source-map (most useful)
* source-map

## Linting
The project is set to use linting by default. You can pass the flag --env.nolint when running your script to turn it off

## Provisioning a server
To stand up an instance to serve the static assets, go to your [Azure Portal](https://portal.azure.com/#) and click `New` => `Web + Mobile` => `Web App`.

Enter a name for your app, pick a subscription, and either create or select a resource group. Click `Create` and it will start creating the server for you.

Once it it complete, click on your Web App (easiest if you pinned to dashboard on the previous step) and then click on the url to go the your website page. Add `.scm` after the name in the url (e.g. `aveera.scm.azurewebsites.net`) to go to the Kudu dashboard. Go to `Debug console` => `CMD`. This will take you to the app file system. Navigate through `site` => `wwwroot` where you should see the default html file. Delete that, and add a file named `Web.config`. Edit that file with the following xml (from http://stackoverflow.com/questions/26659777/serving-index-html-on-all-the-incoming-http-requests-in-node-js)
```
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <system.webServer>
     <rewrite>
             <rules>
                 <rule name="redirect all requests" stopProcessing="true">
                     <conditions logicalGrouping="MatchAll">
                         <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" pattern="" ignoreCase="false" />
                     </conditions>
                     <action type="Rewrite" url="index.html" appendQueryString="true" />
                 </rule>
             </rules>
         </rewrite>
    </system.webServer>
</configuration>
```
This will redirect all requests (`/`, `/dashboard`, etc...) to index.html.

You can also use the Kudu dashboard to manually upload files to your server to serve. Otherwise, read on to learn about creating a `Buddy` pipeline.

## Buddy Pipelines

### Deploying a manual branch
This will step through the process of creating a pipeline in Buddy that can deploy a specified branch to your frontend server. This assumes that you have already provisioned a server in Azure.

1. Go into Buddy, and go to the `react-frontend` project. On the right, click `Add a new pipeline`. Name it, set Trigger Mode to Manual, Branch to Specific branch, and select the branch (if you haven't pushed a branch, any one will do for now). In the future, you will have to edit the pipeline settings to select the branch you want to deploy. Click `Add a new pipeline`
2. Click to add a new action. The first thing we will need to do is deploy, so under the subheading `EXECUTE BUILDS & COMMANDS IN A DOCKER CONTAINER` select `node`. First, copy the following commands into the top of the prompt:
```
mkdir -p /root/.ssh
cp uploads/id_rsa /root/.ssh/id_rsa
chmod 600 /root/.ssh/id_rsa
eval "$(ssh-agent -s)"
ssh-add /root/.ssh/id_rsa
touch /root/.ssh/known_hosts
ssh-keyscan -H github.com >> /root/.ssh/known_hosts
npm install
BASE_URL=${BACKEND_URL} DOMAIN_NAME=${DOMAIN_NAME} TARGET=web npm run build -- --env.production
```
Assuming that the MetamasonDev github user's private ssh key is in a folder called uploads (which you will need to add), then this will add that key to the container's keys and add github to the list of known hosts. This is necessary because `npm install` needs to be able to install private packages from github.
4. Click `Add Action` and then add another action. Select FTPS and then add `/build` for 'What to upload from the filesystem'. Find your azure instance, select it, and copy the FTPS hostname from Azure and paste it into the hostname field in Buddy. Remove the `ftps://` from the front.
5. Go into Azure with your VM selected, and click on `Deployment credentials` to set a deployment username and password. Once those are set, add them to the buddy action. In the Remote Path field, type `/site/wwwroot`. Add the action.
6. You'll need to add some buddy environment variables for the build. From the pipeline page, click 'Environment variables' on the right, and add `DOMAIN_NAME` with the value equal to the domain name for the frontend (e.g. aveera-test1.azurewebsites.net) and `BACKEND_URL` with a value equal to the url for api requests (e.g. http://23.102.173.225:3000) (notice the port 3000)
7. That's it! You can add slack notifications by creating a slack action and taking the default config. If you add it within the success bucket it will automatically create a success notification, and within the failure bucket it will create a failure notification.