const urlBase = 'https://cis4004-lamp-team-3.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
    let firstName = document.getElementById("registerFirstName").value;
    let lastName = document.getElementById("registerLastName").value;
    let login = document.getElementById("registerLogin").value;
    let password = document.getElementById("registerPassword").value;

    document.getElementById("registerResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0)
                {
                    document.getElementById("registerResult").innerHTML =
                        jsonObject.error;
                    return;
                }

                document.getElementById("registerResult").innerHTML =
                    "Account created. You can now log in.";
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function addContact()
{
    let contactFirstName = document.getElementById("contactFirstName").value;
    let contactLastName = document.getElementById("contactLastName").value;
    let contactPhone = document.getElementById("contactPhone").value;
    let contactEmail = document.getElementById("contactEmail").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        userId: userId,
        firstName: contactFirstName,
        lastName: contactLastName,
        phone: contactPhone,
        email: contactEmail
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0)
                {
                    document.getElementById("contactAddResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("contactAddResult").innerHTML = "Contact added";

                document.getElementById("contactFirstName").value = "";
                document.getElementById("contactLastName").value = "";
                document.getElementById("contactPhone").value = "";
                document.getElementById("contactEmail").value = "";

                searchContacts();
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContacts()
{
    let srch = document.getElementById("searchText").value;

    document.getElementById("contactSearchResult").innerHTML = "";
    document.getElementById("contactList").innerHTML = "";

    let tmp = {
        search: srch,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0)
                {
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                    return;
                }

                let text = "";

                 for (let i = 0; i < jsonObject.results.length; i++)
                {
                    let contact = jsonObject.results[i];
                
                    text += "<div class='contactRow'>";
                    text += "<input type='text' id='firstName" + contact.id + "' value='" + contact.firstName + "'>";
                    text += "<input type='text' id='lastName" + contact.id + "' value='" + contact.lastName + "'>";
                    text += "<input type='text' id='phone" + contact.id + "' value='" + contact.phone + "'>";
                    text += "<input type='text' id='email" + contact.id + "' value='" + contact.email + "'>";
                
                    text += "<button type='button' class='smallButton' onclick='updateContact(" + contact.id + ");'>Update</button>";
                    text += "<button type='button' class='smallButton' onclick='deleteContact(" + contact.id + ");'>Delete</button>";
                
                    text += "</div><br>";
                }
                
                document.getElementById("contactList").innerHTML = text;
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function updateContact(contactId)
{
    let firstName = document.getElementById("firstName" + contactId).value;
    let lastName = document.getElementById("lastName" + contactId).value;
    let phone = document.getElementById("phone" + contactId).value;
    let email = document.getElementById("email" + contactId).value;

    let tmp = {
        contactId: contactId,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0)
                {
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("contactSearchResult").innerHTML = "Contact updated";
                searchContacts();
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function deleteContact(contactId)
{
    let tmp = {
        contactId: contactId,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0)
                {
                    document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                    return;
                }

                document.getElementById("contactSearchResult").innerHTML = "Contact deleted";
                searchContacts();
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
    document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
