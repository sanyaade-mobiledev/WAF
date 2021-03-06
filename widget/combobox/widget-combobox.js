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
//// "use strict";

/*global WAF,window*/

/*jslint white: true, browser: true, onevar: true, undef: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: true */

WAF.Widget.provide(

    /**
     *      
     * @class TODO: give a name to this class (ex: WAF.widget.DataGrid)
     * @extends WAF.Widget
     */
    'Combobox',   
    {        
    },
    /**
     * @constructor
     * @param {Object} inConfig configuration of the widget
     */

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     **/
    function WAFWidget(config, data, shared) {
        var 
        source,
        widget,
        options,
        firstInit,
        htmlObject,
        optionsLength;

        widget              = this;
        htmlObject          = $(this.containerNode); 
        
        this._combobox      = htmlObject.children('select');
        
        this._key           = data['binding-key'];
        
        this._autoDispatch  = !data['autoDispatch'] || data['autoDispatch'] == 'false' ? false : true;     
        
        this._limit         = !data['limit'] ? this._limit : parseInt(data['limit']);
              
        source = this.source;
        
        if (source) {
            options         = data['binding-options'].replace(/\[/g, '').replace(/\]/g, '').split(' ');
            
            this._options   = [];
            for (i = 0; i < options.length; i += 1) {
                if (options[i]) {
                    this._options.push(options[i])
                }
            }
            
            optionsLength   = options.length;
            
            this._combobox.html('');
            
            source.addListener('all', function(e) {
                var
                i,
                ds,
                dsID,
                kind,
                attr,
                value,
                index,
                widget,
                dsLength,
                dataSource;

                widget      = e.data.widget;
                kind        = e.eventKind;
                dataSource  = e.dataSource;
                dsID        = e.dataSource.getID();

                switch(kind) {
                    case 'onCollectionChange' :
                        widget.clear();
                            
                        firstInit   = true;
                        dsLength    = dataSource.length;
                        widget._tmp = {};

                        for (i = 0; i < dsLength; i += 1) {
                            index = i;
                            if (!widget._limit || i < widget._limit) {
                                dataSource.getElement(i, {
                                    onSuccess : function(e){
                                        var
                                        i,
                                        ds,
                                        value,
                                        widget,
                                        option,
                                        attribute,
                                        identifier;
                                        
                                        ds      = e.data.source;
                                        option  = [];
                                        widget  = e.data.widget;
                                        
                                        if (e.element) {
                                    
                                            for (i = 0; i < optionsLength; i += 1) {
                                                attribute   = options[i];
                                                if (attribute) { 
                                                    value = e.element[attribute];

                                                    /*
                                                     * Format value depending on ds attribute format
                                                     */
                                                    if (e.dataSource && e.dataSource.getAttribute(attribute).dataClassAtt) {
                                                        format  = e.dataSource.getAttribute(attribute).dataClassAtt.defaultFormat;                                            
                                                        value   = WAF.utils.formatString(value, format);
                                                    }

                                                    option.push(value);
                                                }
                                            }                                   

                                            if (ds._private.sourceType != 'dataClass' && ds._private.sourceType != 'relatedEntities') {
                                                widget._primary = ds._private.attNameList[0];
                                            } 

                                            attr = (!widget._key || dsID == widget._key) ? widget._primary : widget._key;                

                                            if (ds._private.sourceType != 'dataClass' && ds._private.sourceType != 'relatedEntities') {
                                                identifier  = e.position;
                                            } else {
                                                identifier = e.element[widget._primary];
                                            }

                                            widget._tmp[index] = identifier;

                                            widget.addOption(e.element[attr], option.join(' '));
                                        }
                                    }
                                }, {
                                    source : dataSource,
                                    widget : widget
                                });
                            }
                        }
                            
                        /*
                         * Select sourceout value after sourcein has been loaded
                         */
                        if (widget._tmpValue && widget.sourceOut) {
                            widget.setValue(widget._tmpValue);
                        }
                        
                        break;
                        
                    case 'onCurrentElementChange' :
                        if (widget._autoDispatch) {                            
                            ds      = e.dataSource;   
                            
                            if (ds._private.sourceType != 'dataClass' && ds._private.sourceType != 'relatedEntities') {
                                widget._primary = ds._private.attNameList[0];
                            }
                                        
                            attr    = (!widget._key || dsID == widget._key) ? widget._primary : widget._key;                                                              

                            value   = e.dataSource.getAttributeValue(attr);

                            /*
                             * If value is not into the limit of displayed options
                             */
                            if (value !== null && widget.$domNode.find('option[value="' + value + '"]').length === 0) {
                                var
                                i,
                                pos,
                                first,
                                count,
                                collection;

                                i           = 0;
                                count       = 0;
                                pos         = ds.getPosition();
                                collection  = ds.getEntityCollection();

                                widget._tmp = {};

                                widget.clear();

                                if (!collection) {
                                    return;
                                }
                                
                                if (pos + 5 > collection.length) {
                                    first = collection.length - 5;
                                } else {
                                    first = pos;
                                }

                                widget._posInCombo = {};

                                collection.each(function(elt) {
                                    var 
                                    j,
                                    values;

                                    if (i >= first && count < widget._limit) {
                                        values = [];

                                        for (j = 0; j < optionsLength; j += 1) {
                                            attribute   = options[j];
                                            if (attribute) { 
                                                values.push(elt.entity[attribute].value);
                                            }
                                        }

                                        widget._posInCombo[elt.position] = count;

                                        attr = (!widget._key || dsID == widget._key) ? widget._primary : widget._key;                

                                        if (ds._private.sourceType != 'dataClass' && ds._private.sourceType != 'relatedEntities') {
                                            identifier  = elt.position;
                                        } else {
                                            identifier = elt.entity[widget._primary].value;
                                        }

                                        widget._tmp[count] = identifier;

                                        widget.addOption(elt.entity[attr].value, values.join(' '));

                                        count += 1;
                                    }

                                    i += 1;
                                });
                            }

                            widget.setValue(value);

                            /*
                             * To prevent first dispatch if widget is binded
                             * on source out
                             */
                            if (firstInit && widget.sourceOut) {
                                // DO NOTHING
                            } else {                                
                                /*
                                 * Case of source out
                                 */
                                if (widget.sourceOut) {
                                    switch (widget._sourceOutInfo.dataClassAtt.kind) {
                                        case 'relatedEntity':
                                            break;                                            
                                          
                                        default :
                                            widget.sourceOut.getAttribute(widget._sourceOutInfo.attName).setValue(value);
                                            break;
                                    }
                                }
                            }
                        }
                        
                        firstInit = false;
                        
                        break;

                    /*
                     * Change combobox value on attribute change
                     */
                    case 'onAttributeChange' :
                        this._attributeHasChanged = true;
                        break;

                    /*
                     * Change combobox option on save
                     */
                    case 'onElementSaved' :
                        var
                        i,
                        ds,
                        attr,
                        label,
                        option,
                        values,
                        position,
                        identifier;

                        ds          = e.dataSource;
                        attr        = (!widget._key || dsID == widget._key) ? widget._primary : widget._key;  
                        values      = [];          
                        position    = e.position;

                        if (ds._private.sourceType != 'dataClass' && ds._private.sourceType != 'relatedEntities') {
                            identifier  = position;
                        } else {
                            identifier = e.entity[widget._primary].value;
                        }

                        if (widget._posInCombo) {
                            position = widget._posInCombo[position];
                        }

                        widget._tmp[position] = identifier;

                        for (i = 0; i < optionsLength; i += 1) {
                            attribute   = options[i];
                            if (attribute) { 
                                values.push(e.entity[attribute].value);
                            }
                        }

                        label = WAF.utils.formatString(values.join(' '), widget.format);

                        /*
                         * Find the option into the combo
                         */
                        option = widget.$domNode.find('option').eq(position);

                        /*
                         * Change option value and label
                         */
                        option
                            .html(label)
                            .val(e.entity[attr].value);

                        break;
                }
            }, {
                
            }, {
                widget : this
            });
        }          
    },        
    {
        _primary        : 'ID',
        
        _limit          : 20,
        
        _key            : null,
        
        _input          : null,
        
        _button         : null,
        
        _list           : null,
        
        _combobox       : null,
        
        _isBuilt        : false,
        
        _sourceOutInfo  : null,
        
        _tmpValue       : null,
        
        _autoDispatch   : false,
        
        _tmp            : {},
        
        sourceOut       : null,
        
        /**
         * Get the related attribute depending on the binding datasource
         * @method _getRelatedAttribute
         * @param {object} source
         * @param {string} attr
         */
        _getRelatedAttribute : function combobox_get_related_attribute(source, attr) {
            var
            i,
            result,
            widget,
            currentSource;
            
            widget = this;
            
            for (i in source) {
                currentSource = source[i];
                
                if (currentSource && currentSource.emAtt) {
                    if (WAF.utils.ucFirst(attr) == currentSource.emAtt.path) {
                        result = currentSource
                    }
                }
            }
            
            return result;
        },
        
        /**
         * Custom ready function
         * @method ready
         */
        ready : function combobox_ready() {
            var
            that,
            list,
            layout,
            tagWidth,
            buttonSize;
            
            that            = this;
            buttonSize      = 25,
            tagWidth        = this.getWidth();  
            
            this._editable  = !this.config['data-editable'] || this.config['data-editable'] == 'false' ? false : true;   
        
            if (this.config['data-binding-out']) {

                this._sourceOutInfo = WAF.dataSource.solveBinding(this.config['data-binding-out']);
                if (this._sourceOutInfo) {
                    this.sourceOut = this._sourceOutInfo.dataSource;
                }
            }

            this._combobox = this._combobox || this.$domNode.children('select');
            
            if (this._combobox && this._combobox.length > 0) {
                /*
                 * Set select as combobox
                 */
                this._combobox.combobox();

                /*
                 * Resize combo components
                 */

                this._input     = this.$domNode.children('input');
                this._button    = this.$domNode.children('button');

                this._input.css({
                    'width'     : (tagWidth - (buttonSize + 2)) + 'px',
                    'height'    : '100%'
                });

                this._button.css({
                    'width'     : buttonSize + 'px',
                    'height'    : '100%'
                });

                /*
                 * Add class to list
                 */            
                this._list = this._input.autocomplete( "widget" );
                this._list.addClass('waf-combobox-list-' + this.id + ' waf-combobox-list ' + this.getTheme());
                           
                /*
                 * Change datasource onchange event
                 */
                this._input.bind( "autocompleteselect", {sourceOut : that.sourceOut, widget : that}, function(e, ui) {
                    var
                    i,
                    evt,
                    that,
                    value,
                    index,
                    event,
                    source,
                    option,
                    events,
                    widget,
                    eventsL,
                    htmlObject,
                    successFunction;

                    evt         = e;
                    widget      = e.data.widget;
                    option      = $(ui.item.option)
                    value       = option.attr('value');
                    index       = option.index();
                    htmlObject  = $(this);


                    widget._changeFromCombo = true;
                            
                    /*
                     * Get on change event to execute it after autocomplete
                     * select event
                     */
                    events  =  WAF.events[widget.id];
                    
                    if (events) {
                        eventsL = events.length;                    

                        for (i = 0; i < eventsL; i += 1) {
                            event = events[i];

                            if (event.name == 'change') {
                                widget._callbackChange = event.fn;
                            }
                        }
                    }

                    if (widget.source && widget._autoDispatch) {
                        successFunction = function(e) {
                            var
                            widget,
                            source;

                            widget = e.data.widget;

                            /*
                             * Case of source out
                             */
                            if (widget.sourceOut) {
                                switch (widget._sourceOutInfo.dataClassAtt.kind) {
                                    case 'relatedEntity':
                                        source = widget._getRelatedAttribute(widget.sourceOut, widget.source.getID());

                                        if (source) {
                                            widget.source.getDataClass().getEntity(widget._tmp[index], {
                                                onSuccess: function(e) {
                                                    e.userData.source.set(e.entity);
                                                }
                                            }, {source : source})
                                        }
                                        break;

                                    default :
                                        widget.sourceOut.getAttribute(widget._sourceOutInfo.attName).setValue(value);
                                        break;
                                }
                            }
                            
                            if (widget._callbackChange) {
                                widget._callbackChange(evt);
                            }
                        };
                        

                        if (widget.source._private.sourceType == 'dataClass' || widget.source._private.sourceType == 'relatedEntities') {
                            widget.source.selectByKey(widget._tmp[index], {
                                onSuccess : successFunction
                            }, {
                                widget : widget
                            });
                        } else {
                            widget.source.select(widget._tmp[index], {
                                onSuccess : successFunction
                            }, {
                                widget : widget
                            });
                        }
                    } else {
                        widget.setValue($(ui.item.option).val());

                        if (widget.sourceOut) {
                            switch (widget._sourceOutInfo.dataClassAtt.kind) {
                                case 'relatedEntity':
                                    source = widget._getRelatedAttribute(widget.sourceOut, widget.source.getID());

                                    if (source) {
                                        widget.source.getDataClass().getEntity(widget._tmp[index], {
                                            onSuccess: function(e) {
                                                source.set(e.entity);
                                            }
                                        })
                                        //source.set(widget.source);
                                    }
                                    break;

                                default :
                                    widget.sourceOut.getAttribute(widget._sourceOutInfo.attName).setValue(value);
                                    break;
                            }
                        }
                    }
                    
                });     
                
                // ********* <STATES EVENTS> *********
                this.$domNode.hover(
                    function () {
                        if (that.getState() != 'active') {
                            that.setState('hover');
                        }

                        that._hasOver = true;
                    },
                    function () {
                        if (that.getState() == 'active') {
                            that.setState('active');
                        } else {
                            that.setState('default');
                        }

                        that._hasOver = false;
                    }
                );

                this._input.focusin(function() {
                    that.setState('active');
                })
                .focusout(function() {
                    that.removeState('active');
                });       

                this._input.bind( "autocompleteopen", function(event, ui) {
                    $(this).focus();
                    that.$domNode.addClass("waf-state-active");
                });

                this._input.bind( "autocompleteclose", function(event, ui) {
                    that.removeState('active');
                });
                // ********* </STATES EVENTS> ********
                
                /*
                 * If not editable, create a clickable layout to prevent focus
                 * on autocomplete input
                 */
                if (!this._editable) {
                    layout = $('<div>').css({
                        'position'      : "absolute",
                        'width'         : this._input.width(),
                        'height'        : this._input.height(),
                        'top'           : 0,
                        'left'          : 0,
                        'background'    : 'transparent',
                        'cursor'        : 'pointer'
                    });
                    
                    this.$domNode.append(layout);
                    
                    layout.bind('mousedown', function(){
                        that._button.click();
                        return false;
                    });                    
                    
                    this._input.css({'cursor' : 'pointer'});

                    this._input.attr('readonly', 'readonly');

                    this._input.attr('disabled', 'disabled');
                }
                
                /*
                 * Execute query to find into combobox
                 */
                if (this.source) {
                    this._input.bind( "keyup", function(event, ui) {
                        var
                        i,
                        attr,
                        value,
                        input,
                        attrType,
                        optionsL,
                        valToFind,
                        queryString;

                        if (that._limit < that.source.length) {

                            
                            /*
                             * Do not execute query if up or down key
                             */
                            if (event.keyCode == 40 || event.keyCode == 38) {
                                return;
                            }

                            input = $(this);
                            value = input.val();

                            queryString = [];
                            optionsL    = that._options.length;

                            for (i = 0; i < optionsL; i += 1) {
                                attr = that._options[i];
                                
                                queryString.push(attr + ' = :1');
                            }

                            queryString = queryString.join(' OR ');

                            that.source.getEntityCollection().query(queryString, {
                                limit : 1,
                                onSuccess : function(e){
                                    var
                                    count;

                                    count = 0;

                                    if (that._tmpFindedLength != e.result.length) {

                                        that.clear(false);

                                        e.result.forEach(function(e){
                                            if ( e.entity && count < that._limit ){
                                                var
                                                i,
                                                attr,
                                                label,
                                                option,
                                                length;

                                                label   = [];

                                                length  = that._options.length;

                                                for (i = 0; i < length; i += 1) {
                                                    option = that._options[i];

                                                    if (option) {
                                                        label.push(e.entity[option].getValue());
                                                    }
                                                }

                                                attr = !e.entity[that._key] ? that._primary : that._key;

                                                that.addOption(e.entity[attr].getValue(), label.join(' '));
                                                
                                                that._tmp[count] = e.entity.getKey();
                                            }
                                            
                                            count += 1;
                                        },{
                                            limit : that._limit
                                        });
                                    }

                                    that._tmpFindedLength = e.result.length;

                                    input.autocomplete( "search" , value );
                                },
                                params: [value + WAF.wildchar]
                            });
                        }
                    });
                }
                
            }
            
            if (that.sourceOut) {
                that.sourceOut.addListener('all', function(e){
                    var
                    kind,
                    value,
                    widget;
                    
                    widget  = e.data.widget;
                    kind    = e.eventKind;

                    if (!widget._changeFromCombo) {
                        switch(kind) {
                            case 'onElementSaved' :
                                widget._changeFromCombo = true;
                                break;

                            case 'onAttributeChange' :
                            case 'onCurrentElementChange' :
                                value = e.dataSource.getAttribute(widget._sourceOutInfo.attName).getValue();

                                if (value && typeof(value) == 'object' && value[widget._primary]) {
                                    value = value[widget._primary];
                                } else if (value && typeof(value) == 'object') {       
                                    // @DIRTY : find another way to get related attribute primary value
                                    value = value.__deferred.__KEY;
                                }          

                                if (typeof value === 'undefined') {
                                    value = '';
                                }  

                                widget.setValue(value);
                                
                                widget._tmpValue = value;
                                
                                that._changeFromCombo = false;
                                break;
                        }
                    } else {
                        that._changeFromCombo = false;
                    }

                }, {
                
                }, {
                    widget : that
                })
            }

            /*
             * Also format not binded combobox
             */
            if (!this.source && this._input) {
                var
                value;

                value = this._input.val();

                value = WAF.utils.formatString(value, this.format);
                
                this._input.val(value);
                
                $.each(this.$domNode.find('option'), function() {
                    var
                    label;

                    label = $(this).html();

                    label = WAF.utils.formatString(label, that.format);

                    $(this).html(label)
                })
            }
        },
        
        /**
         * Custom setValue function
         * @method setValue
         * @param {string} value
         */
        setValue : function combobox_set_value(value) {
            var
            i,
            event,
            events,
            eventsL;
            if (typeof value == 'undefined' || value === '') {
                this._input.val('');
            } else {
                this._combobox.combobox('setValue', value);
            }
            
            /*
             * Trigger change event
             */          
            if (!this._callbackChange) {
                events  =  WAF.events[this.id];
                
                if (events) {
                    eventsL = events.length;                    

                    for (i = 0; i < eventsL; i += 1) {
                        event = events[i];

                        if (event.name == 'change') {
                            this._callbackChange = event.fn;
                        }
                    }
                }
            }

            if (this._callbackChange) {
                this._callbackChange();
            }
        },
        
        /**
         * Add an option to the combobox
         * @method addOption
         * @param {string} value
         * @param {string} label
         * @param {boolean} selected
         */
        addOption : function combobox_add_option(value, label, selected) {
            label = label || value;        

            if (this.source) {
                if (this.source.getAttribute(this._key)) {
                    switch (this.source.getAttribute(this._key).type) {
                        case 'long':
                        case 'long64':
                        case 'number':
                            value = parseInt(value);
                            break;
                    }
                }

                if (this._options.length == 1) {
                    switch (this.source.getAttribute(this._options[0]).type) {
                        case 'long':
                        case 'long64':
                        case 'number':
                            label = parseInt(label);
                            break;
                    }
                }
            }

            label = this.getFormattedValue(label);    

            this._combobox.append($('<option value=\'' + value + '\'>').html(label));
            
            if (selected) {
                this._combobox.combobox('setValue', value);
            }
        },
                
        /**
         * Remove an option to the combobox
         * @method removeOption
         * @param {number} index
         */
        removeOption : function combobox_remove_option(index) {
            var
            option,
            currentIndex;

            
            option = $(this._combobox.children('option').get(index - 1));
            
            if (option.val() == this.getValue()) {
                this.setValue('');
            }

            if (option.length > 0) {
                option.remove();
            }

            /*if (currentIndex == index) {
                this.setValue('');
            }*/
        },
        
        
        /**
         * Custom clear function
         * @method clear
         * @param {boolean} clearInput
         */
        clear : function (clearInput) {
            clearInput = typeof(clearInput) == 'undefined' ? true : clearInput;
            
            if (clearInput && this._input) {
                this._input.val('');
            }
            
            if (this._combobox) {
                this._combobox.children().remove();
            }
        },
        
        /**
         * Disable the slider
         * @method disable
         */
        disable : function combo_disable () {
            this._input.attr('disabled', 'disabled')
            this._input.autocomplete('disable');

            /*
             * Call super class disable function
             */
            WAF.Widget.prototype.disable.call(this);
        },
        
        /**
         * Enable the slider
         * @method enable
         * @param {boolean} disable
         */
        enable : function combo_enable () {
            this._input.removeAttr('disabled')
            this._input.autocomplete('enable');       
            
            /*
             * Call super class enable function
             */
            WAF.Widget.prototype.enable.call(this);
        },

        /**
         * Custom widget set state function
         * @function setState
         * @param {string} value
         */
        setState : function setState (value) {
            var
            label,
            nState,
            htmlObject;

            label = this.getLabel();
            
            value = value || 'default';

            if (!this._disabled) {
                htmlObject = this.$domNode;

                htmlObject.addClass('waf-state-' + value);

                if (value == 'hover') {
                    htmlObject.removeClass('waf-state-active');
                }

                if (value == 'active') {
                    htmlObject.removeClass('waf-state-hover');
                    this._input.addClass("waf-state-focus");  
                }

                if (value == 'default') {
                    htmlObject.removeClass('waf-state-hover');
                    htmlObject.removeClass('waf-state-active');
                    htmlObject.removeClass('waf-state-focus');
                    htmlObject.removeClass('waf-state-disabled');

                    this._tmpState = nState;
                }
            }

            if (label) {
                this.getLabel().setState(value);
            }

            this._currentState = value;
        },

        /**
         * Custom widget remove state function
         * @function removeState
         * @param {string} value
         */
        removeState : function setState (value) {
            this.$domNode.removeClass('waf-state-' + value);

            if (value == 'focus') {
                this.removeState('active');
            }

            if (value == 'active') {                
                if (this._hasOver) {
                    this.setState('hover');
                }
            }
            this._currentState = null;
        },

        /**
         * Custom widget getValue function
         * @function getValue
         * @return {string|number} value
         */
        getValue : function () {
            var
            value;

            value = $('#' + this.id + ' select').val();

            /*
             * Check if value a number (depending on datasource)
             */
            if (this.source) {
                switch (this.source.getAttribute(this._key).type) {
                    case 'long':
                    case 'long64':
                    case 'number':
                        value = parseInt(value);
                        break;
                }
            }

            return value;
        }

    }
);

/*
 * Fig bug on combobox list doesn't disappear
 */
$(document).bind('click', function(e) {
    var
    id,
    target;

    target = $(e.target);
    parents = target.parents('.waf-combobox');
    isCombo = target.is('.waf-combobox');

    if (parents.length > 0 || isCombo) {
        id = isCombo ? target.prop('id') : parents.prop('id');
        $('.waf-combobox-list').not('.waf-combobox-list-' + id + '').hide();
    } else {
        $('.waf-combobox-list').hide();
    }
})
