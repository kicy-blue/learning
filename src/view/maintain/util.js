
export function getAuto(){
	let carCon = {};
	if (localStorage.getItem("YC51_Web_Auto")) {
	  carCon = JSON.parse(localStorage.getItem("YC51_Web_Auto"));
	} 
	return carCon;
}