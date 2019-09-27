
// calculator.js


// Desc: Resets the color of the corresponding input box.
function resetColor(e) {
	e.style.backgroundColor = ""
} // End of resetColor

// Desc: Calculates the percentage of the corresponding row.
function getPercentage(e) {
	let id = e.id.split('')
	let g1 = e, g2 = e
	id.shift()
	id = parseInt(id.join(""))
	if (id % 2 === 0) {
		id--
		g1 = document.getElementById('g' + id)
	} else {
		g2 = document.getElementById('g' + (id + 1))
	}
	let percentId = 'p' + Math.ceil(id / 2)
	let val = (100 * g1.value / g2.value).toFixed(2)
	if (!isNaN(val) && val != Infinity) {
		val = val + '%'
	} else {
		val = "Error"
	}
	document.getElementById(percentId).innerHTML = val
} // End of getPercentage

// Desc: Check the validation of mean values.
function checkMeanValidation(lst, errIDLst, result) {
	let mean = 0
	for (let i = 0; i < lst.length; i += 2) {
		if (lst[i].value.length === 0 || lst[i + 1].value.length === 0) {
			if (lst[i].value.length === 0)
				errIDLst.push(lst[i])
			if (lst[i + 1].value.length === 0)
				errIDLst.push(lst[i + 1])
			return "Error: Empty field detected"
		} else if (isNaN(+lst[i].value) || isNaN(+lst[i + 1].value)) {
			if (isNaN(+lst[i].value))
				errIDLst.push(lst[i])
			if (isNaN(+lst[i + 1].value))
				errIDLst.push(lst[i + 1])
			return "Error: Non-digit character detected"
		} else if (parseFloat(lst[i].value) < 0 || parseFloat(lst[i + 1].value) < 0) {
			if (parseFloat(lst[i].value) < 0)
				errIDLst.push(lst[i])
			if (parseFloat(lst[i + 1].value) < 0)
				errIDLst.push(lst[i + 1])
			return "Error: Negative score detected"
		} else if (parseFloat(lst[i + 1].value) == 0) {
			errIDLst.push(lst[i + 1])
			return "Error: Cannot divided by zero"
		} else if (parseFloat(lst[i].value) > parseFloat(lst[i + 1].value)) {
			console.log(i)
			errIDLst.push(lst[i])
			return "Error: Score exceeds maximun grade"
		} else {	// Valid
			mean += (parseFloat(lst[i].value) / parseFloat(lst[i + 1].value))
		}
	}
	result.push(mean / (parseInt(lst.length / 2)))
	return ""
} // End of checkMeanValidation

// Desc: Event for the "RESET" button.
document.getElementById("reset").addEventListener("click", () => {
	let inputBoxes = document.getElementsByTagName("input")
	let percents = document.getElementsByName("percent")

	// Clear all the input boxes.
	for (let i = 0; i < inputBoxes.length; i++) {
		inputBoxes[i].style.backgroundColor = ""
		inputBoxes[i].value = ""
	}

	// Clear the percent column.
	for (let i = 0; i < percents.length; i++) {
		percents[i].innerHTML = ""
	}

	// Make the result panel invisible.
	document.querySelector("div[class='mean-result']").style.display = "none"
	document.querySelector("div[class='weighted-result']").style.display = "none"
})

// Desc: Event for the "WEIGHTED" button.
document.getElementById("cal-weight").addEventListener("click", (e) => {
	let mean = document.getElementsByName("mean")
	let weights = document.getElementsByName("weight")
	let errIDLst = []

	// Reset all input boxes color
	for (let i = 0; i < weights.length; i++) {
		weights[i].style.backgroundColor = ""
		mean[2 * i].style.backgroundColor = ""
		mean[2 * i + 1].style.backgroundColor = ""
	}

	// Check the validation of grades.
	let errMsg = checkMeanValidation(mean, errIDLst, [])
	document.querySelector("div[class='weighted-result']").style.display = "inline-block"
	if (errIDLst.length > 0) {
		for (let i = 0; i < errIDLst.length; i++)
			errIDLst[i].style.backgroundColor = "pink"
		document.querySelector("span[class='weighted-val']").innerText = errMsg
		return
	}

	let weightedResult = 0, totalWeight = 0

	// Check the validation of weights.
	for (let i = 0; i < weights.length; i++) {
		if (weights[i].value.length === 0) {
			errIDLst.push(weights[i])
			errMsg = "Error: Empty field detected"
			break
		} else if (isNaN(+weights[i].value)) {
			errIDLst.push(weights[i])
			errMsg = "Error: Non-digit character detected"
			break
		} else if (parseFloat(weights[i].value) < 0) {
			errIDLst.push(weights[i])
			errMsg = "Error: Weight cannot be negative"
			break
		} else {	// Valid
			totalWeight += parseFloat(weights[i].value)
			weightedResult += (
				parseFloat(weights[i].value) * parseFloat(mean[2 * i].value) / parseFloat(mean[2 * i + 1].value)
			)
		}
	}
	if (totalWeight != 0)
		weightedResult /= totalWeight
	else
		weightedResult = 0

	document.querySelector("div[class='weighted-result']").style.display = "inline-block"
	if (errIDLst.length === 0) {
		document.querySelector("span[class='weighted-val']").innerText = weightedResult.toFixed(3)
	} else {
		for (let i = 0; i < errIDLst.length; i++)
			errIDLst[i].style.backgroundColor = "pink"
		document.querySelector("span[class='weighted-val']").innerText = errMsg
		return
	}
})

// Desc: Event for the "MEAN" button.
document.getElementById("cal-mean").addEventListener("click", () => {
	let inputs = document.getElementsByName("mean")
	let errIDLst = [], result = []

	// Reset all input boxes color
	for (let i = 0; i < inputs.length; i++) {
		inputs[i].style.backgroundColor = ""
	}
	// Check for validation
	let errMsg = checkMeanValidation(inputs, errIDLst, result)

	document.querySelector("div[class='mean-result']").style.display = "inline-block"
	if (errIDLst.length === 0) {
		let mean = result[0].toFixed(3)
		document.querySelector("span[class='mean-val']").innerText = mean
	} else {
		for (let i = 0; i < errIDLst.length; i++) {
			errIDLst[i].style.backgroundColor = "pink"
		}
		document.querySelector("span[class='mean-val']").innerText = errMsg
	}
})