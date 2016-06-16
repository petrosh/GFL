var repoForks;

function getForks() {
	apiCall({
		url: "https://api.github.com/repos/" + repoContent.parent.full_name + "/forks",
		cb: function () {
			repoForks = this;
			console.log(this);
		}
	});
}

getForks();
