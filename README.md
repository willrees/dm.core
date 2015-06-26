# DM Core

This library contains all the core utilities, js extensions and help required for creating reusable components.

**Current Stable Version: still in alpha**<br>
**Current Dev Version: .0.0.1**

##Tool Setup

<ul>
	<li><a href="#ContributorSetup">Contributor Setup</a></li>
	<li><a href="#ConsumerSetup">Consumer Setup</a></li>
</ul>

<span name="#ContributorSetup" id="#ContributorSetup">**Contributor Setup**</span>

This library will work with any build tools and ide but for the best experiance you should use the recommended setup.

<ul>
	<li><a href="https://nodejs.org/download/" target="_blank">Install Node JS</a> - For windows make sure node JS is added to the PATH enviornment variable. To check that node was successfully installed open you command line tool(Windows) or terminal(MAC) and execute the commands node -v and npm -v</li>
	<li>Install GRUNT - Javascript Task Runner
		<ul>
			<li>**Windows Users** - Open command line tool as administrator.</li>
			<li>**MAC Users** - Execute the blow commands with the sudo prefix. For example "npm install" would actually be "sudo npm install"</li>
			<li><pre>npm update -g npm</pre></li>
			<li><pre>npm install -g grunt-cli</pre></li>
		</ul>
	</li>
	<li><a href="https://www.visualstudio.com/en-us/products/code-vs.aspx" target="_blank">Install VS Code</a> - You can use any editor but VS code povides the best integration with GitHub and also supports typescript definition files which are used to add intellisense for the dm code base.</li>
	<li>Install GitHub <a href="https://windows.github.com/" target="_blank">Windows</a>, <a href="https://mac.github.com/" target="_blank">MAC</a></li>
</ul>

After all the tooling has been setup you can download the src and start working. To make updates or add new features follow the below directions.

<ul>
	<li>
		First time instructions to download the repo.
		<ul>
			<li>Signin to the GitHub website.</li>
			<li>Click the button Clone in Destop and follow the download instructions.</li>		
		</ul>
	</li>
	<li>
		Before you start working you'll need to start the Javascript task runner to auto compile and minify the source files.
		<ul>
			<li>Open your command line tool. For windows make sure your running as administrator and for mac use sudo</li>
			<li>Navigate to your projects root directory.</li>
			<li>Execute the command npm install.</li>
			<li>Execute the command grunt watch</li>
			<li>If everything was successful you shold see the output "Waiting..."</li>
		</ul>
	</li>		
</ul>


**Consumer Setup**

To use one of the builds just download dm.core.js ro dm.core.min.js from the dist folder under scripts and add it to your project. 

##IntelliSense

This library contains a typescript definition file which will add IntelliSense in VS Code or Visual Studio. To use this feature you will need to include the definition file "dm.core.d.ts" to your project/solution and then add the following reference to every js file 
<pre>/// &lt;reference path="../../typescript.definitions/dm.core.d.ts"/&gt;</pre>


##Documentation

**dm.List**

Overview<br>
	
dm.List  