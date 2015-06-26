# DM Core

This library contains all the core utilities, js extensions and help required for creating reusable components.

**Current Stable Version: still in alpha**<br>
**Current Dev Version: .0.0.1**

##Tool Setup

<ul>
	<li>[Contributor Setup](#ContributorSetup)</li>
	<li>[Consumer Setup](#ConsumerSetup)</li>
</ul>

<span id="#ContributorSetup">**Contributor Setup**</span>

This library will work with any build tools and ide but for the best experiance you should use the recommended setup.

<ul>
	<li>[Install Node JS](https://nodejs.org/download/) - For windows make sure node JS is added to the PATH enviornment variable. To check that node was successfully installed open you command line tool(Windows) or terminal(MAC) and execute the commands node -v and npm -v</li>
	<li>Install GRUNT - Javascript Task Runner
		<ul>
			<li>**Windows Users** - Open command line tool as administrator.</li>
			<li>**MAC Users** - Execute the blow commands with the sudo prefix. For example "npm install" would actually be "sudo npm install"</li>
			<li>npm update -g npm</li>
			<li>npm install -g grunt-cli</li>
		</ul>
	</li>
	<li>[Install VS Code](https://www.visualstudio.com/en-us/products/code-vs.aspx) - You can use any editor but VS code povides the best integration with GitHub and also supports typescript definition files which are used to add intellisense for the dm code base.</li>
	<li>Install GitHub [Windows](https://windows.github.com/), [MAC](https://mac.github.com/)</li>
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
