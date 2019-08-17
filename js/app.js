/* Your code */
let schema = null;
let mainContainer = getMainContainer();

const baseUrl = "http://localhost:8000/";
let questionsUrl = baseUrl + "questions";
let optUrl = baseUrl + "options?question=";

const ratingCount = 10;
let checkOptions;
let ratingSelected = null;

function getMainContainer() {
  return document.getElementById("container");
}
function getSchema(callback) {
  fetch(questionsUrl)
    .then(response => response.json())
    .then(result => {
      schema = result;
      callback();
    })
    .catch((schema = []));
}

function getOptions(
  qid,
  callback,
  title = null,
  container = null,
  mandatory = null
) {
  fetch(optUrl + qid)
    .then(response => response.json())
    .then(result => {
      console.log("result");
      callback(result, title, container, mandatory);
    })
    .catch();
}

function renderSchema() {
  mainContainer = document.getElementById("container");
  let formElement = document.createElement("form");
  formElement.setAttribute("name", "surveyForm");
  formElement.setAttribute("id", "surveyForm");
  mainContainer.appendChild(formElement);

  let totalFields = schema.length;
  for (let i = 0; i < totalFields; i++) {
    renderFields(schema[i]);
  }
  let submitElement = document.createElement("input");
  submitElement.setAttribute("type", "submit");
  formElement.appendChild(submitElement);
  formElement.addEventListener("submit", validateForm);
  mainContainer.appendChild(formElement);
}

//onsubmit="return validateForm()"
function validateForm(e) {
  e.preventDefault();
  let rateValue = ratingSelected;
  // let descValue = document.forms["surveyForm"]["description"].value;
  let satValue = document.forms["surveyForm"]["satisfaction"].value;
  //console.log("all : " + rateValue, descValue, satValue);
  if (rateValue == "" || rateValue == null) {
    alert("Provide rating for the survey");
    return false;
  } else if (satValue == "") {
    alert(
      "Tell us how satisfied you are with this survey, select option accordingly"
    );
    return false;
  } else if (!isValidDescription()) {
    alert("Select at least one description for our product");
    return false;
  } else {
    console.log("submit");
    document.getElementById("surveyForm").submit();
  }
}

function isValidDescription() {
  var len = checkOptions.length;
  for (let i = 0; i < len; i++) {
    if (document.getElementById("description" + i).checked) {
      return true;
    }
  }
  return false;
}

function renderFields(field) {
  // mainContainer = document.getElementById("container");
  let formElement = document.getElementById("surveyForm");
  let newElement;
  switch (field.type) {
    case "textarea":
      formElement.appendChild(getTextAreaElement(field));
      break;
    case "rating":
      formElement.appendChild(getRatingElement(field));
      renderRatings();
      break;
    default:
      formElement.appendChild(getInputElement(formElement, field));
      break;
  }
}

function getInputElement(mainContainer, field) {
  let spanElement = document.createElement("span");
  spanElement.setAttribute("class", "label");
  let labelNode = document.createTextNode(
    field.title + (field.mandatory ? "*" : "")
  );
  spanElement.appendChild(labelNode);

  if (field.has_options) {
    let element = document.createElement("div");
    switch (field.type) {
      case "radio":
        element.setAttribute("id", field.type);
        getOptions(
          field.id,
          renderRadioOptions,
          field.title,
          mainContainer,
          field.mandatory
        );
        break;
      default:
        element.setAttribute("id", field.type);
        getOptions(
          field.id,
          renderCheckOptions,
          field.title,
          mainContainer,
          field.mandatory
        );
        break;
    }
    return element;
  } else {
    mainContainer.appendChild(spanElement);
    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", field.type);
    inputElement.setAttribute("required", field.mandatory);
    return inputElement;
  }
}

function renderRadioOptions(options, title, container, mandatory) {
  var len = options.length;
  let fieldsetElement = document.createElement("fieldset");
  let legendLabelNode = document.createTextNode(title + (mandatory ? "*" : ""));
  let legendElement = document.createElement("legend");
  legendElement.appendChild(legendLabelNode);
  fieldsetElement.appendChild(legendElement);

  let radioContainerElement = document.createElement("div");
  radioContainerElement.setAttribute("class", "radio-container");

  for (let i = 0; i < len; i++) {
    let radioElement = document.createElement("input");
    radioElement.setAttribute("type", "radio");
    radioElement.setAttribute("name", "satisfaction");
    radioElement.setAttribute("value", options[i].value);

    var label = document.createElement("label");
    let radioLabel = getTextNodeElement(options[i].label);
    label.appendChild(radioLabel);
    radioContainerElement.appendChild(radioElement);
    radioContainerElement.appendChild(radioLabel);
  }

  fieldsetElement.appendChild(radioContainerElement);
  let radioDiv = document.getElementById("radio");
  radioDiv.appendChild(fieldsetElement);
}

function renderCheckOptions(options, title, container, mandatory) {
  checkOptions = options;
  var len = options.length;
  let fieldsetElement = document.createElement("fieldset");
  let legendLabelNode = document.createTextNode(title + (mandatory ? "*" : ""));
  let legendElement = document.createElement("legend");
  legendElement.appendChild(legendLabelNode);
  fieldsetElement.appendChild(legendElement);

  let checkContainerElement = document.createElement("div");
  checkContainerElement.setAttribute("class", "checkbox-container");

  for (let i = 0; i < len; i++) {
    let checkElement = document.createElement("input");
    checkElement.setAttribute("type", "checkbox");
    checkElement.setAttribute("id", "description" + i);
    checkElement.setAttribute("value", options[i].value);

    var label = document.createElement("label");
    let checkLabel = getTextNodeElement(options[i].label);
    label.appendChild(checkLabel);
    // checkElement.appendChild(checkLabel);

    checkContainerElement.appendChild(checkElement);
    checkContainerElement.appendChild(checkLabel);
    // fieldsetElement.appendChild(checkElement);
    // fieldsetElement.appendChild(checkLabel);
  }
  fieldsetElement.appendChild(checkContainerElement);
  // container.appendChild(fieldsetElement);
  let checkDiv = document.getElementById("checkbox");
  checkDiv.appendChild(fieldsetElement);
}

function getRatingElement(field, callback) {
  let spanElement = document.createElement("span");
  spanElement.setAttribute("class", "label");
  let labelNode = document.createTextNode(
    field.title + (field.mandatory ? "*" : "")
  );
  spanElement.appendChild(labelNode);

  let ratingElement = document.createElement("div");
  ratingElement.setAttribute("id", "rating");
  ratingElement.appendChild(spanElement);
  return ratingElement;
}

function renderRatings() {
  let rateDiv = document.getElementById("rating");

  for (let i = 0; i < ratingCount; i++) {
    // let radioElement = document.createElement("input");
    // radioElement.setAttribute("type", "radio");
    // radioElement.setAttribute("name", "rate");
    // radioElement.setAttribute("value", i + 1);

    let radioElement = document.createElement("div");
    radioElement.setAttribute("id", "radio-cell" + (i + 1));
    radioElement.innerHTML = i + 1;
    radioElement.addEventListener("click", updateRating);

    var label = document.createElement("label");
    let radioLabel = getTextNodeElement(i + 1);
    label.appendChild(radioLabel);
    rateDiv.appendChild(radioElement);
    // rateDiv.appendChild(radioLabel);
    // fieldsetElement.appendChild(radioElement);
    // fieldsetElement.appendChild(radioLabel);
  }
}

function updateRating(ev) {
  if (ratingSelected) {
    document
      .getElementById("radio-cell" + ratingSelected)
      .classList.remove("active");
  }
  ratingSelected = this.innerHTML;
  document.getElementById(this.id).classList.add("active");
}

function getTextAreaElement(field) {
  let inputElement = document.createElement("textarea");
  inputElement.setAttribute("name", "comments");
  inputElement.setAttribute("rows", "10");
  inputElement.setAttribute("placeholder", field.title);
  return inputElement;
}

function getTextNodeElement(label) {
  return document.createTextNode(label);
}

function startApp() {
  getSchema(renderSchema);
}

startApp();
