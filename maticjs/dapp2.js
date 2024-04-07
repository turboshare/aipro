let web3;

const contractAddress = "0xab2b090608B0BD32179BE79227e3491e8424cCA8";

var spAccount = "Invalid Wallet!";
var contract;
var defaultAccount;
var prevAccount;


var availableBNB = 0;
var tokenBalance = 0;
var isMobile = false;
var hasWeb3 = false;
var contractLoaded = false;

window.addEventListener('load', Connect)

async function Connect() {
	
    if (window.ethereum) 
	{
        console.log('Ethereum Detected!');	
		web3 = new web3js.myweb3(window.ethereum);
        try {
            await ethereum.enable()

            let accounts = await web3.eth.getAccounts()
            defaultAccount = accounts[0]
			anyUpdate();
		    hasWeb3 = true;
            return
        } catch (error) {
            console.error(error)
        }
    
	}else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider)
        let accounts = await web3.eth.getAccounts()
        defaultAccount = accounts[0]
        anyUpdate();
        return
    }
    /*else{
		console.log('No Web3 Detected... using HTTP Provider')
		web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));
		loadContract();
	}	
	*/
    setTimeout(checkForBinanceChain, 1500)
}

async function checkForBinanceChain() {
    try {
        await window.BinanceChain.enable()
        console.log(typeof(window.BinanceChain))
        if (window.BinanceChain) {
            console.log('BinanceChain')
            await BinanceChain.enable()
            window.web3 = new Web3(window.BinanceChain)
            let accounts = await web3.eth.getAccounts()
            defaultAccount = accounts[0]
            anyUpdate()
            return
        }
    } catch (e) {}
} 


function anyUpdate() {
	loadContract();
	loadAccount();	
	setTimeout(anyUpdate, 10000)	
}


async function loadContract()
{
	contract = new web3.eth.Contract(contractABI, contractAddress);
	console.log('Contract Loaded: ' + contract);
    
    
    let balance = await web3.eth.getBalance(contractAddress);
	$('#contractBalance').html(parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(4) + ' MATIC');
    
    let num;
	await contract.methods.invested().call().then(function(result){ num = result; });
	let invested = web3.utils.fromWei(num, 'ether');
	$('#invested').html(parseFloat(invested).toFixed(4) + ' MATIC');
	
	await contract.methods.ref_bonus().call().then(function(result){ num = result; });
	$('#rewards').html(parseFloat(web3.utils.fromWei(num, 'ether')).toFixed(4) + ' MATIC');
	
	await contract.methods.withdrawn().call().then(function(result){ num = result; });
	let withdrawn = web3.utils.fromWei(num, 'ether');
	$('#withdrawn').html(parseFloat(withdrawn).toFixed(4) + ' MATIC');
	
}


async function loadAccount()
{
    let addrs = await window.ethereum.enable();
	defaultAccount = web3.utils.toChecksumAddress(addrs[0]);
	console.log('Loading default Account..'+defaultAccount);    
     
    //$('#my-wallet1').html(defaultAccount); 
     
    let balance1 = await web3.eth.getBalance(defaultAccount);
	myBalance = web3.utils.fromWei(balance1, 'ether');
	$('#my-balance').html( parseFloat(myBalance).toFixed(4) + ' MATIC');
    $('#my-balance2').html( parseFloat(myBalance).toFixed(4) + ' MATIC');
    console.log('MATIC Balance: ' + parseFloat(myBalance).toFixed(4));
    
    await contract.methods.balanceOf(defaultAccount).call().then(function(result){ 
        tokenBalance = parseFloat(web3.utils.fromWei(result)).toFixed(2);
        $('#token-balance').html(tokenBalance);
        $('#token-balance2').html(tokenBalance);
    });
    
    await contract.methods.userInfo(defaultAccount).call().then(function(result){ 
			
		availableBNB = parseFloat(web3.utils.fromWei(result[0])).toFixed(6);
		console.log('Available BNB:' + availableBNB);
		$('#my-bnb').html(availableBNB);
        
        let inv = parseFloat(web3.utils.fromWei(result[1]));    	
        console.log('My Investments:' + inv);
		$('#my-investments').html(parseFloat( inv ).toFixed(4) + ' MATIC');
        
        let harvested = parseFloat(web3.utils.fromWei(result[2]));
        console.log('Withdrawn:' + harvested);
		$('#my-harvests').html(parseFloat( harvested ).toFixed(4) + ' MATIC');
        
        let refbonus = parseFloat(web3.utils.fromWei(result[3]));
        console.log('Commissions:' + refbonus);
		$('#my-drb').html(parseFloat( refbonus ).toFixed(4) + ' MATIC');
        
		var structure = result[6];
        for (let i = 0; i < structure.length; i++) {
            $('#referralsCountAtLevel' + (i + 1)).html(structure[i])
        }
         
        if(inv > 0){
            console.log('Displaying ref link..');
            $('#my-referral').val('https://ai-pro.art/index.php?ref='+defaultAccount);
        }else{
            $('#my-referral').val('You will have your MATIC link after your activation.');
        }
     }); 
     
   
    await contract.methods.players(defaultAccount).call().then(function(result){ 
        //$('#withdrawalByUser').html(parseFloat(web3.utils.fromWei(result[7])).toFixed(4) );
		if(result[0] != '0x0000000000000000000000000000000000000000')
		{
		    spAccount = result[0];
	        $('#sp-address').html(spAccount); 
		}
		console.log('SpAccount: '+spAccount);
		
    });	
		
		
	prevAccount = defaultAccount;
	
    var acct = defaultAccount.toString(); 
    var connectedAddr = acct[0] + 
                                acct[1] + 
                                acct[2] + 
                                acct[3] + 
                                acct[4] + 
                                acct[5] + '...' +
                                acct[acct.length-6] + 
                                acct[acct.length-5] + 
                                acct[acct.length-4] + 
                                acct[acct.length-3] + 
                                acct[acct.length-2] + 
                                acct[acct.length-1];
    
    $("#connect-wallet").html(connectedAddr);	
    
    connectedAddr = acct[0] + 
                                acct[1] + 
                                acct[2] + 
                                acct[3] + 
                                acct[4] + 
                                acct[5] + 
                                acct[6] + '...' +
                                acct[acct.length-6] + 
                                acct[acct.length-5] + 
                                acct[acct.length-4] + 
                                acct[acct.length-3] + 
                                acct[acct.length-2] + 
                                acct[acct.length-1];
    
    $("#my-wallet1").html(connectedAddr);	
    
}

function timeConverter(createdAt) {
    var date = new Date(createdAt);
	date.toUTCString()
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth()+1;
	var day = date.getUTCDate();
	
	var hour = date.getUTCHours();
	var minute = date.getUTCMinutes();
	var second = date.getUTCSeconds();
	
	return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}


async function deposit1()
{
	if(!web3 || defaultAccount == '' || spAccount == '' || defaultAccount == '---' || spAccount == 'Invalid Wallet!'){
		return false;
	}
		
	try{
		const sender = await contract.methods.MakeDeposit(spAccount,"60").send({from: defaultAccount, value: web3.utils.toWei($("#txtamount1").val(), "ether")})
				.then(function(result){ 
					//location.reload();	
					loadContract();
	loadAccount();	
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}


async function deposit2()
{
	if(!web3 || defaultAccount == '' || spAccount == '' || defaultAccount == '---' || spAccount == 'Invalid Wallet!'){
		return false;
	}
		
	try{
		const sender = await contract.methods.MakeDeposit(spAccount,"15").send({from: defaultAccount, value: web3.utils.toWei($("#txtamount2").val(), "ether")})
				.then(function(result){ 
					//location.reload();	
					loadContract();
	loadAccount();	
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}


async function deposit3()
{
	if(!web3 || defaultAccount == '' || spAccount == '' || defaultAccount == '---' || spAccount == 'Invalid Wallet!'){
		return false;
	}
		
	try{
		const sender = await contract.methods.MakeDeposit(spAccount,"16").send({from: defaultAccount, value: web3.utils.toWei($("#txtamount3").val(), "ether")})
				.then(function(result){ 
					//location.reload();	
					loadContract();
	loadAccount();	
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}

async function collectDividends()
{
	if(!web3 || defaultAccount == ''){
		return false;
	}
	
	try{
		const sender = await contract.methods.GetDividends().send({from: defaultAccount})
				.then(function(result){ 
					//location.reload();	
					loadContract();
	loadAccount();	
				 }).catch(err => function(){
					console.log(err);
		});
	}catch(err){
		console.log(err);
	}
				
}

