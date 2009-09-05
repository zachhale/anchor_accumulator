/*  Ajax Anchor Watcher for Prototype
 *  (c) 2009 Zach Hale
 *
 *  Ajax Anchor Watcher is freely distributable under the terms of the MIT license.
 *  More info at http://github.com/zachhale/ajax_anchor_watcher
 *
 *--------------------------------------------------------------------------*/

var AjaxAnchorWatcher = Class.create();
var ajax_anchor_watcher = null;

AjaxAnchorWatcher.prototype = {
  initialize : function(element, ajax_url, ajax_method, ajax_parameters, allowed_anchor_keys) {
    this.element = $(element);
    this.ajax_url = ajax_url;
    this.ajax_method = ajax_method || "get";
    this.ajax_parameters = ajax_parameters;
    this.allowed_anchor_keys = allowed_anchor_keys;
    
    this.current_anchor = "#";
    this.current_anchor_pairs = new Hash();
    this.first_run = true;
    
    ajax_anchor_watcher = this;
    
    setInterval(this.checkAnchor, 200);
  },
  
  checkAnchor : function() {
    var watcher = ajax_anchor_watcher;
    
    // if the hash has data in it and has new changes
    if (document.location.hash != "" && document.location.hash != "#" && 
        watcher.current_anchor != document.location.hash) {
      var hash_without_hash = document.location.hash.split("#")[1];
      var anchor_pairs_joined_match = hash_without_hash.match(/((([^#&]+)=([^#&]+))&?)+/);
      
      if (anchor_pairs_joined_match) {
        var anchor_pairs_joined = anchor_pairs_joined_match[0];
        var anchor_pairs = anchor_pairs_joined.split("&");
        var key_value_anchor_pair_count = 0; // to make sure all pairs are key value pairs
    
        anchor_pairs.each(function(anchor_pair) {
          var split_pair = anchor_pair.match(/([^#&]+)=([^#&]+)/);
          key = split_pair[1];
          val = split_pair[2];
                    
          // only if it's a key value pair that's valid
          if (key && val) {
            key_value_anchor_pair_count++;
          
            if (watcher.allowed_anchor_keys == "" || watcher.allowed_anchor_keys == null || 
                watcher.allowed_anchor_keys.include(key)) {
              watcher.current_anchor_pairs.set(key, val);
            }
          }
        });
      
        // if at this point we've got something we need to deal with
        if (anchor_pairs.length == key_value_anchor_pair_count) {
          var generated_query_string = watcher.current_anchor_pairs.toQueryString();
          var generated_anchor = "#" + generated_query_string;
        
          watcher.current_anchor = generated_anchor; // save the anchor
          
          // unless it's the first page load, go to the generated anchor and do the ajax
          if (!watcher.first_run) {
            document.location = watcher.current_anchor;
          
            var generated_ajax_parameters = generated_query_string;
            if (!(watcher.ajax_parameters == "" || watcher.ajax_parameters == null)) {
              generated_ajax_parameters += "&" + watcher.ajax_parameters;
            }
            
            // now finally do the ajax
            new Ajax.Request(watcher.ajax_url, {
              method: watcher.ajax_method,
              parameters: generated_ajax_parameters, 
              onSuccess: function(transport) {
                watcher.element.update(transport.responseText);
              },
              onFailure: function(transport) { 
                alert("An error occurred: " + transport.responseText);
              }
            });
          }
        }
      }
    }
    
    watcher.first_run = false;
  }
}