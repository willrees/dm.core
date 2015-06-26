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
___

##dm.List

###Overview
	
dm.List provides extend functions to the array prototye. It does not modify the actual prototye but instead will add the additional properties and methods to each newly created array. dm.List provides the following functions which are not yet available on the array prototype:

<ul>
	<li>first</li>
	<li>last</li>
	<li>where</li>
	<li>shuffle</li>
	<li>pluck</li>
</ul>

####Usage

You can create an empty list or initialize the list with an existing array of elements. You create a new list type with the following:

<pre>
	var list = new dm.List();
</pre>

or
<pre>
	var usersArray = [{firstName: "John", lastName: "Doe"}, {firstName: "Jane", lastName: "Doe"}];
	var list = new dm.List(usersArray);
</pre>

###Functions

####First

Lirst will return the first object in the array.
<pre>
	var list = new dm.List();
	var first = list.first();
</pre> 

####Last

Last will return the last object in the array.
<pre>
	var list = new dm.List();
	var last = list.last();
</pre> 

####Where

Where is used to filter the list for specific values. For example if you had an array in the following form
<pre>
	var usersList = [
		{
			firstName: "Jack",
			lastName: "O'Neill",
		},
		{
			firstName: "Jean Luc",
			lastName: "Picard",
		},
		{
			firstName: "Jack",
			lastName: "Nicholson",
		},
		{
			firstName: "Lieutenant Commander",
			lastName: "Data",
		}
	]
</pre>

and you executed the following

<pre>
	var list = new dm.List(usersList);
	var filteredList = list.where(function(item) {
		return item.firstName === "Jack";
	});
</pre> 

new list would equal

<pre>
	[
		{
			firstName: "Jack",
			lastName: "O'Neill",
		},		
		{
			firstName: "Jack",
			lastName: "Nicholson",
		}		
	]
</pre>

if there is no matches you will get an empty List().

####Shuffle

Shuffle will randomize the order of the items in the orginal list. 
<pre>
	var list = new dm.List();
	var last = list.shuffle();
</pre> 


####Pluck

Pluck will return a new List() which contains only the property you specified. For example if you execute the following on the usersList above 
<pre>
	var list = new dm.List(usersList);
	var firstNames = list.pluck("firstName");
</pre> 

firstNames would equal

<pre>
	["Jack", "Jean Luc", "Jack", "Lieutenant Commander"]
</pre>