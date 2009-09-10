function updateTotal(amount){
	var e = document.getElementById("totaldiv");
	if (!e)
		return;
	e.innerHTML = amount.toFixed(2);
}

function additemtostore(itemName,itemAmount,itemPicPath,imgAltMsg,id,cartobjName){
// 	var txt  = '<div class="souvenirsItem" style="margin-left:25px;width:100px;" id="store'+id+'" name="store'+id+'">';
	var txt  = '<div class="souvenirsItem" id="store'+id+'" name="store'+id+'">';
	txt += '	<div class="souvenirsItemImage" >';
// 	txt += '		<img src="'+itemPicPath+'" width="73px" height="124px" alt="'+imgAltMsg+'" />';
	txt += '		<img src="'+itemPicPath+'" alt="'+imgAltMsg+'" />';
	txt += '	</div>';
	txt += '	<div class="souvenirsItemDesc">'+itemName+'</div>';
	txt += '	<div class="souvenirsItemCost">'+itemAmount+'$</div>';
	txt += '	<div class="souvenirsAddtocart" onclick="'+cartobjName+'.addItemToCart(\''+itemName+'\',\''+itemAmount+'\',\''+itemPicPath+'\',\''+imgAltMsg+'\',\''+id+'\'); ">Add to Cart</div>';
	txt += '</div>';

	itxt  = document.getElementById('store').innerHTML;
	itxt += txt;
	
	var e = document.getElementById("store")
	if (!e)
		return;
	e.innerHTML = itxt;
}

function clearItem(itemid){
	var e = document.getElementById(itemid);
	if (!e)
		return;
	e.parentNode.removeChild(x);
}

function showdiv( id ){
	var e = document.getElementById( id );
	if (!e)
		return;
	e.style.display = "block";
}

function vanishdiv( id ){
	var e = document.getElementById( id );
	if (!e)
		return;
	e.style.display += "none";
}


function cartobj(objname){
	this.oName        = objname;
	this.maxItems     = 9;
	this.itemsCounter = 0;
	this.totalAmount  = 0;
	this.addItemToCart = function (itemName,itemAmount,itemPicPath,imgAltMsg,id) {
		if (this.itemsCounter>=this.maxItems) {
			alert( "The Cart Is Full" );
		} else {
// 			txt  = '<div class="souvenirsItem" style="margin-left:25px;width:100px;" id="cart'+id+'">';
			txt  = '<div class="souvenirsItem" id="cart'+id+'">';
			txt += '	<div class="cartItemImage" >';
			txt += '		<img src="' + itemPicPath + '" alt="' + imgAltMsg + '" />';
			txt += '	</div>';
			txt += '	<div class="souvenirsItemDesc">' + itemName + '</div>';
			txt += '	<div class="souvenirsItemCost">' + itemAmount + '$</div>';
			txt += '	<div class="souvenirsAddtocart" onclick="clearItem(\'cart'+id+'\');'
				+ this.oName
				+ '.removeItem(\''
				+ itemAmount+'\');">Remove</div>';
			txt += '</div>';
			itxt  =  document.getElementById("cart").innerHTML;
			itxt += txt;
			document.getElementById("cart").innerHTML = itxt;
			document.getElementById("debug").value = itxt;
			this.itemsCounter++;
			this.totalAmount = this.totalAmount+parseFloat(itemAmount);
			updateTotal(this.totalAmount);
		}
	};
	this.removeItem = function (itemAmount) {
		this.itemsCounter--;
		this.totalAmount=this.totalAmount-parseFloat(itemAmount);
		updateTotal(this.totalAmount);
		document.getElementById("souvenirsCheckout").innerHTML=retPaypalCartUploadBtn();
	}
}

function myShopingCart(tmsg){
	showdiv('cart');
	vanishdiv('store');
	document.getElementById('conheader').innerHTML = tmsg;
	document.getElementById("backshopingbtn").style.display = "block";
	txt="<div onclick='retPaypalCartUploadBtn()'>some Paypal text here<div>";
	document.getElementById("souvenirsCheckout").innerHTML = retPaypalCartUploadBtn();
}

function continueshoping(tmsg) {
	vanishdiv("cart");
	showdiv("store");
	document.getElementById('conheader').innerHTML = tmsg;
	document.getElementById("backshopingbtn").style.display = "none";
	txt='<img src="images/checkout.png" style="border:0;height:20px;width:115px;" onclick="myShopingCart(\'Your Shopping Cart\')" />';
	document.getElementById("souvenirsCheckout").innerHTML = txt;
}

function retPaypalCartUploadBtn() {
	//Check the cart is empty
	mycart=document.getElementById("cart");
	if (mycart.hasChildNodes()==false){
		//alert(" empty cart");
		return "";   
	}
	numOfItems=mycart.childNodes.length;

	//PAYPAL BTN CREATION
	//items part
	itxt='';
	for(i=0;i<numOfItems;i++) {
		iname=mycart.childNodes[i].childNodes[1].firstChild.nodeValue;
		iAmt=mycart.childNodes[i].childNodes[2].firstChild.nodeValue;
		amt=parseFloat(iAmt).toFixed(2);
		itemnumber=i+1;
		itxt+='<input type="hidden" name="item_name_'+itemnumber+'" value="'+iname+'">';
		itxt+='<input type="hidden" name="amount_'+itemnumber+'" value="'+amt+'">';
	}


	myNotifyUrl="http://85.250.70.176/workspace/jhl/myIpnManager.php";
	//if your acount use pp ipn set it
	//   paypalUrl="https://www.sandbox.paypal.com/cgi-bin/webscr";
	paypalUrl="https://www.paypal.com/cgi-bin/webscr";

	//pixelGifUrl="https://www.sandbox.paypal.com/en_US/i/scr/pixel.gif";
	pixelGifUrl="https://www.paypal.com/en_US/i/scr/pixel.gif";

	ppAcountbizmail="karmimo@netvision.net.il";
	//set your acount mail
	btnimg="images/ppco.gif";

	htxt='<form id="ppcart" name="ppcart" action="'+paypalUrl+'" method="post" target="_blank">';
	htxt+='<input type="hidden" name="business" value="'+ppAcountbizmail+'">';
	//   htxt+='<input type="hidden" name="test_ipn" value="1">'; //only if it is sandbox
	htxt+='<input type="hidden" name="cmd" value="_cart">';
	htxt+='<input type="hidden" name="upload" value="1">';
	htxt+='<input type="hidden" name="notify_url" value="'+myNotifyUrl+'">';
	btxt='<input type="hidden" name="cbt" value="Return to Site">';
	btxt+='<input type="hidden" name="currency_code" value="USD">';
	btxt+='<input type="image" style="height:20px;width:115px;border:0;" name="submit" border="0" src="'+btnimg+'" alt="PayPal - The safer, easier way to pay    online" style="border:0px;width:125px;">';
	btxt+=' <img alt="" border="0" width="1" height="1" src="'+pixelGifUrl+'" style="visibility:hidden"> </form>';
	return (htxt+itxt+btxt);
}
