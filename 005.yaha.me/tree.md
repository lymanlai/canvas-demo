while we have new idea about project architecture, we should write down at here,
so we build next app, we can get the idea of it.


app/
  components/
  i18n/
    share-en-US.json
    share-zh-CN.json
    moduleName-en-US.json
    moduleName-zh-CN.json
  images/
  styles/
  template/ #angular-bootstrap template
  scripts/
    boot.js #boot up script
    yh.js
    yh/
    moduleName/
      main.js         #main code, have the module's lib function
      list.js         #list view code, most of the time, it show  this module's item list
      list.html       #list template
      item.js         #item view detail code
      item.html       #item template
      itemXXX.js
      itemXXX.html
      add.js          #add: while you want to item add form, should have this
      add.html
      addXXX.js       #addXXX: while you want more form
      addXXX.html

