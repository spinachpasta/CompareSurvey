var connectionMatrix = [];
var size = [];

function choose() {
	return new Promise((resolve, reject) => {
		$("#button0").click(function () {
			resolve(-1);
		});
		$("#button1").click(function () {
			resolve(1);
		});
		$("#showres").click(function () {
			resolve(0);
		});
	});
}
window.onload = function () {
	main();
};


async function main() {
	const data = await $.ajax({
		url: "dataset.json",
		dataType: "json"
	});
	console.log(data);
	$("#title").text(data.title);
	const resultMatrix = [];
	for (let i = 0; i < data.choices.length; i++) {
		resultMatrix.push(new Array(data.choices.length));
	}
	var breakflag = false;
	for (let i = 1; i < data.choices.length; i++) {
		for (let j = 0; j < i; j++) {
			const choiceid = [i, j];
			if (Math.random() < 0.5) {
				choiceid[0] = j;
				choiceid[1] = i;
			}
			const choice0 = data.choices[choiceid[0]] || {};
			const choice1 = data.choices[choiceid[1]] || {};
			$("#img0").attr("src", choice0.imageUrl || "");
			$("#button0").text(choice0.name || "");
			$("#img1").attr("src", choice1.imageUrl || "");
			$("#button1").text(choice1.name || "");
			var answer = await choose();
			if (answer == 0) {
				breakflag = true;
				break;
			}
			resultMatrix[choiceid[0]][choiceid[1]] = answer;
			resultMatrix[choiceid[1]][choiceid[0]] = -answer;
		}
		if (breakflag) {
			break;
		}
	}
	$("#question").css("display", "none");
	$("#result").css("display", "block");
	var maxsize = 0;
	for (var i = 0; i < data.choices.length; i++) {
		var count = 0;
		for (var j = 0; j < i; j++) {
			if (resultMatrix[i][j] !== undefined) {
				count++;
			}
		}
		if (count != i) {
			maxsize = i - 1;
			break;
		}
	}
	console.log(maxsize);
	console.log(resultMatrix);
	var resultTable = [];
	for (var i = 0; i < data.choices.length; i++) {
		var r = { imageUrl: data.choices[i].imageUrl, row: resultMatrix[i] };
		r.count = 0;
		for (var a of resultMatrix[i]) {
			if (!isNaN(a)) {
				r.count += a;
			}
		}
		resultTable.push(r);
	}
	resultTable = resultTable.sort((a, b) => a.count - b.count);
	console.log(resultTable);
	//resultTable.sort
	for (var r of resultTable) {
		$("#table").append($(`<tr><td><img src="${r.imageUrl}" /> </td></tr>`));
	}
}