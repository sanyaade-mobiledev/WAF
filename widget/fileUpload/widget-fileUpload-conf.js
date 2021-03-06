/*
* This file is part of Wakanda software, licensed by 4D under
*  (i) the GNU General Public License version 3 (GNU GPL v3), or
*  (ii) the Affero General Public License version 3 (AGPL v3) or
*  (iii) a commercial license.
* This file remains the exclusive property of 4D and/or its licensors
* and is protected by national and international legislations.
* In any event, Licensee's compliance with the terms and conditions
* of the applicable license constitutes a prerequisite to any use of this file.
* Except as otherwise expressly stated in the applicable license,
* such license does not include any other license or rights on this file,
* 4D's and/or its licensors' trademarks and/or other proprietary rights.
* Consequently, no title, copyright or other proprietary rights
* other than those specified in the applicable license is granted.
*/
WAF.addWidget({
    
    /**
     *  Widget Descriptor
     *
     */ 
    
    /* PROPERTIES */

    // {String} internal name of the widget
    type        : 'fileUpload',  

    // {String} library used ('waf', 'jquery', 'extjs', 'yui') (optional)
    lib         : 'WAF',

    // {String} display name of the widget in the GUI Designer 
    description : 'File Upload',

    // {String} category in which the widget is displayed in the GUI Designer
    category    : 'Form Controls',

    // {String} image of the tag to display in the GUI Designer (optional)
    img         : '/walib/WAF/widget/fileUpload/icons/widget-fileUpload.png', 

    // {Array} css file needed by widget (optional)
    css         : [],                                                     

    // {Array} script files needed by widget (optional) 
    include     : [],                 

    // {String} type of the html tag ('div' by default)
    tag         : 'div',                               

    // {Array} attributes of the widget. By default, we have 3 attributes: 'data-type', 'data-lib', and 'id', so it is unnecessary to add them
    // 
    // @property {String} name, name of the attribute (mandatory)     
    // @property {String} description, description of the attribute (optional)
    // @property {String} defaultValue, default value of the attribute (optional)
    // @property {'string'|'radio'|'checkbox'|'textarea'|'dropdown'|'integer'} type, type of the field to show in the GUI Designer (optional)
    // @property {Array} options, list of values to choose for the field shown in the GUI Designer (optional)
    attributes  : [
    {
        name       : 'data-binding',
        description: 'Source',
        onchange   : function(){
            Designer.tag.refreshPanels();
        }
    },{
        name        : 'data-label',
        description : 'Label',
        defaultValue: 'Label'
    },{
               name        : 'data-label-position',
               description : 'Label position',
               defaultValue: 'left'
       },{
        name        : 'data-action',
        visibility  : 'hidden',
        defaultValue: 'false',
        type        : 'checkbox'
    },{
        name        : 'data-text',
        description : 'Text',
        defaultValue: 'Drag your file(s) here'
    },{
        name        : 'data-maxfilesize',
        visibility  : 'hidden',
        defaultValue: '-1'
    },{
        name        : 'data-maxfilesize-unity',
        visibility  : 'hidden',
        defaultValue: 'KB'
    },{
        name        : 'data-maxfiles',
        visibility  : 'hidden',
        defaultValue: '-1'
    },{
        name        : 'data-folder',
        visibility  : 'hidden',
        defaultValue: 'tmp'
    },{
        name        : 'data-autoUpload',
        visibility  : 'hidden',
        defaultValue: 'false'
    },{
        name        : 'data-userAction',
        visibility  : 'hidden',
        defaultValue: 'Ask the user'
    },{
        name        : 'data-notification',
        description : 'Display notification',
        type        : 'checkbox',
        defaultValue: 'true'
    },{
        name        : 'data-listStyle',
        description : 'Display file list as',
        type        : 'radiogroup',
        options     : [{
            key : 'popup', 
            value : 'Popup'
        }, {
            key : 'menu', 
            value : 'List'
        }],
        defaultValue: 'menu'
    }
    ],

    // {Array} default height and width of the container for the widget in the GUI Designer
    // 
    // @property {String} name, name of the attribute 
    // @property {String} defaultValue, default value of the attribute  
    style: [                                                                     
    {
        name        : 'width',
        defaultValue: '240px'
    },
    {
        name        : 'height',
        defaultValue: '35px'
    }],

    // {Array} events ot the widget
    // 
    // @property {String} name, internal name of the event (mandatory)     
    // @property {String} description, display name of the event in the GUI Designer
    // @property {String} category, category in which the event is displayed in the GUI Designer (optional)
    events: [
    {
        name       : 'filesUploaded',
        description: 'On After Upload',
        category   : 'Upload Events'
    },
    {
        name       : 'filesExists',
        description: 'On File Exists',
        category   : 'Upload Events'
    }],

    // {JSON} panel properties widget
    //
    // @property {Object} enable style settings in the Styles panel in the Properties area in the GUI Designer
    properties: {
        style: {
            theme       : true,
            fClass      : true,
            text        : true,
            background  : true,
            border      : true,
            sizePosition: true,
            shadow      : true,
            textShadow  : true,
            innerShadow : true,
            label       : false
        },
        state : [{
            label   : 'hover',
            cssClass: 'waf-state-dragover',
            find    : ''
        },{
            label   : 'active',
            cssClass: 'waf-state-notempty',
            find    : ''
        }]
    },

    // (optional area)
    // 
    // {Array} list of sub elements for the widget
    // 
    // @property {String} label of the sub element
    // @property {String} css selector of the sub element
    structure: [
    //    {
    //        description : 'Files container',
    //        selector    : '.waf-fileUpload-tabContainer',
    //        style: {
    //            fClass      : true,
    //            text        : false,
    //            background  : true,
    //            border      : true,
    //            sizePosition: true,
    //            dropShadow  : true,
    //            innerShadow : true,
    //            label       : false,
    //            disabled    : []
    //        }
    //    },
    //    {
    //        description : 'File Item',
    //        selector    : '.waf-fileUpload-fileItem',
    //        style: {
    //            fClass      : true,
    //            text        : false,
    //            background  : true,
    //            border      : true,
    //            sizePosition: true,
    //            dropShadow  : true,
    //            innerShadow : true,
    //            label       : false,
    //            disabled    : []
    //        },
    //        state : [
    //        {
    //            label   : 'hover',
    //            cssClass: 'waf-state-hover',
    //            find    : ''
    //        }
    //        ]
    //    }
    ],

    /* METHODS */

    /*
     * function to call when the widget is loaded by WAF during runtime
     * 
     * @param {Object} config contains all the attributes of the widget  
     * @result {WAF.widget.Template} the widget
     */
    onInit: function (config) {  
        new WAF.widget.FileUpload(config);       
    },

    /**
     * function to call when the widget is displayed in the GUI Designer
     * 
     * @param {Object} config contains all the attributes for the widget
     * @param {Designer.api} set of functions used to be managed by the GUI Designer
     * @param {Designer.tag.Tag} container of the widget in the GUI Designer
     * @param {Object} catalog of dataClasses defined for the widget
     * @param {Boolean} isResize is a resize call for the widget (not currently available for custom widgets)
     */
    onDesign: function (config, designer, tag, catalog, isResize) {
        var
        htmlObj,
        paragraph,
        linkedTags;
        
        /**
         * CSS classes object
         */
        tag.classes = {
            btnBrowse   : 'waf-fileUpload-btnBrowse',
            btnUpload   : 'waf-fileUpload-btnUpload',
            btnDelete   : 'waf-fileUpload-btnDelete',
            btnCardinal : 'waf-fileUpload-btnCardinal',
            filesList   : {
                classname   : 'waf-fileUpload-fileList',
                children    : {
                    table   : 'waf-fileUpload-fileList-table',
                    tr      : 'waf-fileUpload-fileItem',
                    tdname  : 'waf-fileUpload-fileItem-name',
                    tdbutton: 'waf-fileUpload-fileItem-button'
                },
                states      : {
                    popup   : 'waf-fileUpload-fileList-popup',
                    menu    : 'waf-fileUpload-fileList-menu'
                }
            },
            tag         : {
                classname   : 'waf-fileUpload',
                children    : {
                    paragraph   : 'waf-fileUpload-paragraph'
                }
            }
        }
        
        if(!tag.getFULinkedWidgets){
            return;
        }
        
        htmlObj         = tag.getHtmlObject();
        linkedTags      = tag.getFULinkedWidgets();
        paragraph       = htmlObj.children('p').length == 0 ? $('<p>').appendTo(htmlObj) : $(htmlObj.children('p')[0]);
        
        paragraph.addClass(tag.classes.tag.children.paragraph);
        paragraph.css({
            'padding-top'   : tag.getHeight()/2 - 7
        });
        paragraph.html(tag.getAttribute('data-text').getValue() || '');
        
        // Fill the table container
        
        
        if(isResize){
            if(linkedTags.filesList && tag.refreshFileList){
                var
                fileList    = linkedTags.filesList;
                
                tag.refreshFileList();

                fileList.setWidth(tag.getWidth())
                fileList.setY(tag.getHeight(), true, false);
            }
        }
        
    },
    
    onCreate : function(tag,param){
        var
        group,
        btnUpload,
        btnDelete,
        filesList,
        btnBrowse,
        paragraph,
        btnCardinal;
        
        tag._oldSource  = tag.getSource();
        group           = new Designer.ui.group.Group();
        
        /*
         * Apply theme on widget theme's change
         */
        tag.onChangeTheme = function(theme) {
            var
            group;
            
            group = D.getGroup(this.getGroupId());
        
            if (group) {
                group.applyTheme(theme, this);
            }
        }
        
        /**
         * get linked widgets
         * @method getLinkedWidgets
         * @return {object} widgets
         */
        tag.getFULinkedWidgets = function get_linked_widgets(){
            var
            widgets,
            linkedTags,
            tag = this;
            
            linkedTags  = tag.getLinks();
            widgets     = {
                
            };
            
            for (var i = 0, widget; widget = linkedTags[i]; i++) {
                var htmlObj = widget.getHtmlObject();
                
                if(htmlObj.hasClass(tag.classes.filesList.classname)){
                    widgets.filesList = widget;
                }
                
                else if(htmlObj.hasClass(tag.classes.btnBrowse)){
                    widgets.btnBrowse = widget;
                }
                
                else if(htmlObj.hasClass(tag.classes.btnUpload)){
                    widgets.btnUpload = widget;
                }
                
                else if(htmlObj.hasClass(tag.classes.btnDelete)){
                    widgets.btnDelete = widget;
                }
                
                else if(htmlObj.hasClass(tag.classes.btnCardinal)){
                    widgets.btnCardinal = widget;
                }
            }
            
            return widgets;
        }
        
        
        /**
         * get refresh the fileList
         * @method refreshFileList
         * @return null
         */
        tag.refreshFileList = function refresh_file_list(){
            var linkedTags      = tag.getFULinkedWidgets();
            
            if(linkedTags && linkedTags.filesList){
                var
                fileList        = linkedTags.filesList,
                tabContainer    = fileList.getHtmlObject().empty(),
                filesTab        = $('<table>').appendTo(tabContainer).addClass(tag.classes.filesList.children.table),
                files           = ['File 1.png' , 'File 2.pdf' , 'File 3.jpg'];

                for (var i = 0 , f; f = files[i]; i++) {
                    var tr = $('<tr>').addClass(tag.classes.filesList.children.tr).appendTo(filesTab);
                    $('<td>').addClass(tag.classes.filesList.children.tdname).html(f).appendTo(tr);
                    $('<td>').addClass(tag.classes.filesList.children.tdbutton).html($('<button>')).appendTo(tr);
                }

                switch(tag.getAttribute('data-listStyle').getValue()){
                    case 'menu' :
                        fileList.addClass( tag.classes.filesList.classname + ' ' + tag.classes.filesList.states.menu);
                        break;
                    case 'popup' :
                        fileList.addClass( tag.classes.filesList.classname + ' ' + tag.classes.filesList.states.popup);
                        break;
                }

                fileList.domUpdate();
            }
        }
        
        /**
         * Add buttons to the FU widget
         * @method _addButtons
         */
        tag._addButton = function add_button(parent , position , config){
            var
            button;
            
            config.text         = config.text || "";
            config.fitToRight   = config.direction || true;
            
            button = Designer.createTag({
                type        : 'button',
                fit         : ['right' , 'top' , 'bottom'],
                silentMode  : true,
                parent      : parent,
                width       : config.width,
                height      : config.height
            });

            config.fitToRight && button.setFitToLeft(false);
            button.getAttribute('class').setValue( config['class'] );
            
            button.getAttribute('data-text').setValue(config.text);
            button.savePosition('left', position.left);
            button.savePosition('top', position.top);
            button.savePosition('right', position.right);
            button.savePosition('bottom', position.bottom);
            parent.link(button);
            
            button.domUpdate();
            
            return button;
        }
        
        if (!param._isLoaded) {
            group.add(tag);

            btnBrowse = tag._addButton(
                tag, 
                {
                    left    : null,
                    top     : 6,
                    right   : 4,
                    bottom  : null
                } , 
{
                    text    : "...",
                    'class' : tag.classes.btnBrowse,
                    width   : 23,
                    height  : 23
                }
                );
            
            group.add(btnBrowse);
            
            btnUpload = tag._addButton(
                tag, 
                {
                    left    : null,
                    top     : 6,
                    right   : 31,
                    bottom  : null
                } , 
{
                    text    : " ",
                    'class' : tag.classes.btnUpload,
                    width   : 21,
                    height  : 24
                }
                );
            
            group.add(btnUpload);
            
            btnCardinal = tag._addButton(
                tag, 
                {
                    left    : null,
                    top     : 11,
                    right   : 54,
                    bottom  : null
                } , 
{
                    text    : "n",
                    'class' : tag.classes.btnCardinal,
                    width   : 15,
                    height  : 15
                }
                );
            
            group.add(btnCardinal);
            
            btnDelete = tag._addButton(
                tag, 
                {
                    left    : null,
                    top     : 11,
                    right   : 71,
                    bottom  : null
                } , 
{
                    text    : "x",
                    'class' : tag.classes.btnDelete,
                    width   : 15,
                    height  : 15
                }
                );
            
            group.add(btnDelete);

            filesList = Designer.createTag({
                type        : 'container',
                width       : tag.getWidth(),
                height      : 50,
                left        : -1,
                top         : tag.getHeight()-1,
                silentMode  : true,
                parent      : tag
            });

            //filesList.getAttribute('class').setValue( tag.classes.filesList.classname + ' ' + tag.classes.filesList.states.menu);
            filesList.addClass(tag.classes.filesList.classname + ' ' + tag.classes.filesList.states.menu);

            tag.link(filesList);
            filesList.link(tag);
            filesList.refresh();

            group.add(filesList);

            Designer.ui.group.save();
        }
        
        else {   
            /*
             * Execute script when widget is entirely loaded (with linked tags) 
             */
            $(tag).bind('onReady', function(){
                tag.refreshFileList();
            });
        }
        
        tag.refresh();
    }
});
