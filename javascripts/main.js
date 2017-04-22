$(document).ready(function(){
	let selectedHeroes;
	let mainArray=[];
	let genderArray = [];
	let teamArray = [];
	let characterArray = [];
	let selectedCharacterArray=[];
	let selectedTeam;
	$("#content").html(`<img src="./images/marvel_logo.png" class="img-responsive center-block" alt="Marvel logo">`);

	const loadPage = () => {
		let cardString = "";
		for (let x=0; x< selectedCharacterArray.length; x++){
			for (let y=0;y<genderArray.length; y++){
				if (selectedCharacterArray[x].gender_id===genderArray[y].id){
					selectedCharacterArray[x].gender_id=genderArray[y].type;
				}
			}
			if (selectedCharacterArray[x].description === "" && selectedCharacterArray[x].gender_id==="Female"){
				selectedCharacterArray[x].description = "abcde fghij klmno pqrst uvwxy z";
			} else if (selectedCharacterArray[x].description === "" && selectedCharacterArray[x].gender_id ==="Male"){
				selectedCharacterArray[x].description = "1234567890";
			}
			if (x%4===0){
				cardString+=`<div class="row">`;
			}
  			cardString+=`<div class="col-sm-6 col-md-3">`;
		    cardString+=`<div class="thumbnail">`;
        	cardString+=`<h3>${selectedCharacterArray[x].name}</h3>`;
        	if (selectedCharacterArray[x].gender_id==="Male"){
			    cardString+=`<img class = "img-circle male" src="${selectedCharacterArray[x].image}" alt="${selectedCharacterArray[x].name}">`;
	        }else{
	        	cardString+=`<img class = "img-circle female" src="${selectedCharacterArray[x].image}" alt="${selectedCharacterArray[x].name}">`;

	        }
	        cardString+=`<div class="caption">`;
	        cardString+=`<p>${selectedCharacterArray[x].description}</p>`;
        	cardString+=`</div></div></div>`;
        	if (x%4===3){
	        	cardString+=`</div>`;
	        }
		}
		$("#content").html(cardString);
	};

	const sortCharacters = () => {
		selectedCharacterArray=[];
		for (let n=0; n<teamArray.length; n++){
			if (teamArray[n].name ===selectedHeroes){
				selectedTeam = teamArray[n].id;
			} 
		}
		for (let k=0; k<characterArray.length; k++){
				console.log(selectedTeam);
			if(characterArray[k].team_id===selectedTeam){
				selectedCharacterArray.push(characterArray[k]);
			}
		}
		loadPage();
	};

	const reArrangeData = () => {
		
			let genderCounter =0;
			let teamCounter =0;
			let characterCounter=0;
		for (let j=0; j<mainArray.length;j++){
			let currentArray = mainArray[j];
			let currentKeys =Object.keys(currentArray);
			if (currentKeys.includes("type")){
				genderArray[genderCounter]=mainArray[j];
				console.log(genderArray);
				genderCounter++;
			}else if (currentKeys.length===2){
				teamArray[teamCounter]=mainArray[j];
				teamCounter++;
			} else {
				characterArray[characterCounter]=mainArray[j];
				characterCounter++;
			}
		}

		sortCharacters();
	};
	const dataGetter = (event)=>{
		mainArray=[];
		selectedHeroes = event.currentTarget.value;
		const loadCharacters = () => {
			return new Promise ((resolve, reject) => {
				$.ajax("./db/characters.json")
				.done((data) => resolve(data.characters))
				.fail((error) => reject(error));
			});

		};
		const loadGenders = () => {
			return new Promise ((resolve, reject) => {
				$.ajax("./db/genders.json")
				.done((data2) => resolve(data2.genders))
				.fail((error) => reject(error));
			});
		};
		const loadTeams = () => {
			return new Promise ((resolve, reject) => {
				$.ajax("./db/teams.json")
				.done((data3) => resolve(data3.teams))
				.fail((error) => reject(error));
			});
		};
		Promise.all([loadCharacters(), loadGenders(), loadTeams()])
		.then((result) => {
			result.forEach((allData) => {
				for (let i=0; i<allData.length; i++){
					mainArray.push(allData[i]);
				}
			});
			reArrangeData();
		});
	};

	$(".btn").click(dataGetter);




});