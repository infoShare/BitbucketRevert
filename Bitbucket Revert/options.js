/* options.js
 * Revert bitbucket merge configuration. 
 * Used in chrome extension.
 * Version 1.1
 * 2017-07-13 18:25:19
 *
 * By Tomasz Foryś
 * License: MIT
 *   See https://github.com/infoShare/BitbucketRevert/blob/master/LICENSE.md
 */

//Default configuration
var dir = "C:\\cms";
var pr = false;
var usr = "admin";
var pwd = "password";
var repo = "https://git.sbr.com";
var prj = "CMS";
var slg = "cms";

function save_options() {
  var dir = document.getElementById('dir').value;
  var usr = document.getElementById('usr').value;
  var pr = document.getElementById('pr').checked;
  var pwd = document.getElementById('pwd').value;
  var repo = document.getElementById('repo').value;
  var prj = document.getElementById('prj').value;
  var slg = document.getElementById('slg').value;
  
  chrome.storage.sync.set({'dir':dir, 'pr':pr, 'usr':usr, 'pwd':pwd, "repo":repo, "prj":prj, "slg":slg}, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {status.textContent = '';}, 750);
  });
}

function restore_options() {
  chrome.storage.sync.set({'dir':dir, 'pr':pr, 'usr':usr, 'pwd':pwd, "repo":repo, "prj":prj, "slg":slg}, function() {
	document.getElementById('dir').value = dir;
	document.getElementById('pr').checked = pr;
	document.getElementById('usr').value = usr;
	document.getElementById('pwd').value = pwd;
	document.getElementById('repo').value = repo;
	document.getElementById('prj').value = prj;
	document.getElementById('slg').value = slg;
	
    var status = document.getElementById('status');
    status.textContent = 'Options restored.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}


function reset_options() {
  chrome.storage.sync.get({dir:dir, pr:pr, usr:usr, pwd:pwd, repo:repo, prj:prj, slg:slg}, function(items) {
    document.getElementById('dir').value = items.dir;
	document.getElementById('pr').checked = items.pr;
	document.getElementById('usr').value = items.usr;
	document.getElementById('pwd').value = items.pwd;
	document.getElementById('repo').value = items.repo;
	document.getElementById('prj').value = items.prj;
	document.getElementById('slg').value = items.slg;
  });
}

document.getElementById('save').addEventListener('click',save_options);
document.getElementById('restore').addEventListener('click',restore_options);
document.addEventListener('DOMContentLoaded', reset_options);