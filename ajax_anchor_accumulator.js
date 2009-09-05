/*  Ajax Anchor Accumulator for Prototype
 *  (c) 2009 Zach Hale
 *
 *  Ajax Anchor accumulator is freely distributable under the terms of the MIT license.
 *  More info at http://github.com/zachhale/anchor_accumulator
 *
 *--------------------------------------------------------------------------*/
 
var AjaxAnchorAccumulator = Class.create();

AjaxAnchorAccumulator.prototype = {
  initialize : function(ajax_url, ajax_options, allowed_anchor_keys) {
    var accumulator_function = function(generated_query_string) {
      // attach generated query string to the passed ajax options parameters
      if (!(ajax_options.parameters == "" || ajax_options.parameters == null)) {
        ajax_options.parameters += "&" + generated_query_string;
      }
      
      new Ajax.Request(ajax_url, ajax_options); // do the ajax!
    }

    new AnchorAccumulator(accumulator_function, allowed_anchor_keys);
  }
}