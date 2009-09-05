/*  Ajax Anchor Accumulator for Prototype
 *  (c) 2009 Zach Hale
 *
 *  Ajax Anchor accumulator is freely distributable under the terms of the MIT license.
 *  More info at http://github.com/zachhale/anchor_accumulator
 *
 *--------------------------------------------------------------------------*/
 
var AjaxAnchorAccumulator = Class.create();
var ajax_anchor_accumulator = null;

AjaxAnchorAccumulator.prototype = {
  initialize : function(element, ) {
    var accumulator_function = function(anchor_pairs) {
      var element = "content";
      var ajax_url = "/";
      var ajax_method = "post";
      var ajax_parameters = "secret=mysterious";
      var allowed_anchor_keys = ["sort","filter"];

      new AjaxAnchorWatcher(element, ajax_url, ajax_method, ajax_parameters, allowed_anchor_keys);   

      var generated_query_string = accumulator.current_anchor_pairs.toQueryString();
      var generated_anchor = "#" + generated_query_string;

      accumulator.current_anchor = generated_anchor; // save the anchor

      // unless it's the first page load, go to the generated anchor and do the ajax
      if (!accumulator.first_run) {
        document.location = accumulator.current_anchor;

        var generated_ajax_parameters = generated_query_string;
        if (!(accumulator.ajax_parameters == "" || accumulator.ajax_parameters == null)) {
          generated_ajax_parameters += "&" + accumulator.ajax_parameters;
        }


      new Ajax.Request(accumulator.ajax_url, {
        method: accumulator.ajax_method,
        parameters: generated_ajax_parameters, 
        onSuccess: function(transport) {
          accumulator.element.update(transport.responseText);
        },
        onFailure: function(transport) { 
          alert("An error occurred: " + transport.responseText);
        }
      });
    }

    new AnchorAccumulator(element, accumulator_function, allowed_anchor_keys);
  }
}
/*
  var element = "content";
  var ajax_url = "/";
  var ajax_method = "post";
  var ajax_parameters = "secret=mysterious";
  var allowed_anchor_keys = ["sort","filter"];

  new AjaxAnchorWatcher(element, ajax_url, ajax_method, ajax_parameters, allowed_anchor_keys);   

  var generated_query_string = accumulator.current_anchor_pairs.toQueryString();
  var generated_anchor = "#" + generated_query_string;

  accumulator.current_anchor = generated_anchor; // save the anchor

  // unless it's the first page load, go to the generated anchor and do the ajax
  if (!accumulator.first_run) {
    document.location = accumulator.current_anchor;

    var generated_ajax_parameters = generated_query_string;
    if (!(accumulator.ajax_parameters == "" || accumulator.ajax_parameters == null)) {
      generated_ajax_parameters += "&" + accumulator.ajax_parameters;
    }

    // now finally do the ajax
    new Ajax.Request(accumulator.ajax_url, {
      method: accumulator.ajax_method,
      parameters: generated_ajax_parameters, 
      onSuccess: function(transport) {
        accumulator.element.update(transport.responseText);
      },
      onFailure: function(transport) { 
        alert("An error occurred: " + transport.responseText);
      }
    });
  }   
});*/