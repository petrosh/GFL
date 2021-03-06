// league-setup.js

var setupSchema = {};

if (userType != 'owner' || repoType != 'Organization') window.location = repoHome;

setupEditor();

apiCall({
  url: fileUrl('master', 'schema/setup.json'),
  cb: function() {
    setupSchema = JSON.parse(atob(this.content));
    // Initialize the editor
    var editor = new JSONEditor(domEditor,{
      ajax: true,
      schema: setupSchema.properties.leagues,
      startval: jsonLeagues,
      no_additional_properties: false,
      required_by_default: false,
      // Special
      disable_properties: true,
      disable_edit_json: true,
      disable_array_reorder: false
    });
    domSubmit.addEventListener('click',function() { saveLeagues(editor.getValue()); });
    domCancel.addEventListener('click',function() { window.location = repoHome; });
    editor.on('change',function() {
      var errors = editor.validate();
      if (errors.length) {
        console.log(errors);
        domValid.style.color = 'red';
        domValid.textContent = "not valid";
      } else {
        domValid.style.color = 'green';
        domValid.textContent = "valid";
      }
    });
  }
});

function saveLeagues(dati) {
  hideEditor();
  for (var i = 0; i < dati.length; i++) {
    if ( !dati[i].slug ) dati[i].slug = (shaLeagues) ? shaLeagues : sessionStorage.masterRef;
  }
  var encodedLeagues = b64e(JSON.stringify(dati));
  apiCall({
    url: repoAPI + '/contents/leagues.json',
    method: 'PUT',
    data: shaLeagues ? '{"message": "leagues edited", "content": "' + encodedLeagues + '", "branch": "data", "sha": "' + shaLeagues + '"}' : '{"message": "leagues created", "content": "' + encodedLeagues + '", "branch": "data"}',
    cb: function(){
      sessionStorage.setItem('dataRef', this.commit.sha);
      domAlert('saved: <a href="' + repoHome + '">proceed</a>');
    }
  });
}
