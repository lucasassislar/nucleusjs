# nucleusjs
Library for simplifying web pages construction



# Use cases

# 1. Getting information from a REST service (POST/GET)
# 1.1 POST
	To do a post request, use the method nukePost:

	// Executes an Ajax Post using JQuery (expects default ResponseObject)
	// url: The url to post
	// data: The data to post
	// onSuccess: Function to be called if sucess is achieved
	// onError: Function to be called if shit happens
	function nukePost(url, data, onSuccess, onError)

	Example:
	nukePost('localhost/rest/test', { key : 'value' }, function () { });

	data, onSuccess and onError are not needed for the method to execute successfully.

	It expects the result to be a ResponseObject, which has a basic structure of:
	{
		var data;
		var resultCode;
	}

	You can also do POST requests asynchronously by using the aPost method on the nmask modifier:
	<div nmask='async(aPost, "localhost/rest/test).data"' name='test'></div>

# 1.2 GET
	Use the method nukeGet

	// Executes an Ajax Get using JQuery (expects default ResponseObject)
	// url: The url to get
	// onSuccess: Function to be called if sucess is achieved
	// onError: Function to be called if shit happens
	function nukeGet(url, onSuccess, onError) 

	onSuccess and onError are not needed for the method to execute successfully.


# 2. Populating the document with a JavaScript object
	You can populate an element with a javascript object by using the method
	
	// Populates every input/div component with the name property equals to the variable name on the data, 
	// based on the data provided
	//  data: Data to populate form with
	//  formId: An specific component to limit search to. If null/ommited will search through all $(document)
	function nukePopulateForm(data, formId) 

	This method will look for input/divs that match the name of the variable on the data object, and populate these elements.
	If the nmask attribute is present, it will first mask it using the info contained on it.

	Example:
	HTML:
	<div id='myForm'>
		<input type='numeric' name='id'></input>
		<input type='text' name='test'></input>
	</div>

	JS:
	var data = {};
	data.id = 25;
	data.test = 'test';
	nukePopulateForm(data, '#myForm');



# 2.1 Masks
		Masks can be used to modify the value of an element before it being updated into the form.

		Example:
		<input type='text' name='id' nmask='R$ + $value$'></input>

		This will automaticaly mask the value inserted into that input to have a value of 'R$' + the value to insert. Nmasks can execute async requests,
		which are used by calling the async method. See session 3 for more information.

		Example:
		<div name='test' nmask='async(aGet, 'localhost/rest/test?key=$value$').data'></div>

		This will execute the aGet function, passing the 'localhost/rest/test?key=$value$' url as a parameter, and will
		insert the data returned by it on the value.

# 3. Async
	Some functions on the Nucleus library support async execution. 
	Because JavaScript is not natively async, this function is only really used on HTML calls, like nmasks.

# 	3.1 Structure of an Async Function
		A Nucleus Async function will ALWAYS have the first argument be an asyncObject.
		When your function succeeds, it should call the asyncObject.onSuccess to sinalize it's finished.

		function asyncTest(asyncObject, stuff){
			asyncObject.onSuccess();
		}


# 4. Nuke Parameter
	You can add the nuke parameter to an HTML element to execute functions with it. 

	
	You can implement a new function by using __nukeHandlers.yourFunctionName, with parameters (words, parent).
	See __nukeHandlers.exists for the most basic implementation.


# 4.1 Foreach
		The foreach function will loop through all elements in an array, and repeat the code based on it.

		Example:
		JS:
		tests = [];
		tests[0] = { key : 'value', test : 'test' }
		tests[1] = { key : 'value', test : 'test' }
		nukeRefresh();

		HTML:
		<div nuke='foreach tests'>
			<div>$key$</div>
			<div>$test$</div>
		</div>

		Variables can be accessed by using $variableName$
		The current loop index can be accessed by using $__index$



# 4.2 Exists
		The exists function will remove a component if the supplied function returns false.

		Example:
		HTML:
		<div nuke='exists isNan('test')'></div>

# 4.3 Value
		The value function will update a value in an object based on the input value.

		Example:
		JS:
		obj = {};

		HTML:
		<input type='checkbox' nuke='value obj.testBox'></input>

# 4.4 Checkbox
		The checkbox function cascades the change on it's parent input to all other checkboxes by the desired selector


		HTML:
		<input type='checkbox' nuke='checkbox .otherCheckboxes'></input>
		<input type='checkbox' class='otherCheckboxes'></input>
		<input type='checkbox' class='otherCheckboxes'></input>
		<input type='checkbox' class='otherCheckboxes'></input>
		<input type='checkbox' class='otherCheckboxes'></input>


# 5. Extract information from document
	You can use the function nukeGetFormData to extract information from the document

	// Extracts information from input components
	// formId: An specific component to limit search to. If null/ommited will search through all $(document)
	function nukeGetFormData(formId)

	This function will return a new object, with each variable named after each input's id on the documents.