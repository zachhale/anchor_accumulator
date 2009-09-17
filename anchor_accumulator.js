/*  Anchor Accumulator for Prototype
 *  (c) 2009 Zach Hale
 *
 *  Ajax Anchor accumulator is freely distributable under the terms of the MIT license.
 *  More info at http://github.com/zachhale/anchor_accumulator
 *
 *--------------------------------------------------------------------------*/

var AnchorAccumulator = Class.create();
var anchor_accumulator = null;

AnchorAccumulator.prototype = {
  initialize : function(accumulator_function, allowed_anchor_keys, refresh_after_callback) {
    this.accumulator_function = accumulator_function;
    this.allowed_anchor_keys = allowed_anchor_keys;
		this.refresh_after_callback = refresh_after_callback;
    
    this.current_anchor = "";
    this.current_anchor_pairs = new Hash();
    this.first_run = true;
    
    anchor_accumulator = this;
    
    this.observeAnchorLinks();
		this.checkAnchor(document.location.hash);
  },

	observeAnchorLinks : function() {
    var accumulator = anchor_accumulator;

		var all_anchors = $$("a[href^='#']");
		
		all_anchors.each(function(elm) {
			elm.observe("click", function(e) {
				var new_anchor = e.target.readAttribute('href');
				accumulator.checkAnchor(new_anchor, e);
			});
		})
	}, 
  
  checkAnchor : function(new_anchor, e) {
    var accumulator = anchor_accumulator;
    
    // if the hash has data in it and has new changes
    if (new_anchor != accumulator.current_anchor) {
      var hash_without_hash = new_anchor.split("#")[1];
      var anchor_pairs_joined_match = hash_without_hash.match(/((([^#&]+)=([^#&]*))&?)+/);
    
      if (anchor_pairs_joined_match) {
        var anchor_pairs_joined = anchor_pairs_joined_match[0];
        var anchor_pairs = anchor_pairs_joined.split("&");
      
        var key_value_anchor_pair_count = 0;
        var valid_key_value_anchor_pair_count = 0;
  
        anchor_pairs.each(function(anchor_pair) {
          var split_pair = anchor_pair.match(/([^#&]+)=([^#&]*)/);
          var key = split_pair[1];
          var val = split_pair[2];
        
          key_value_anchor_pair_count++;
        
          // if it's a key value pair that's valid
          if (accumulator.allowed_anchor_keys == "" || accumulator.allowed_anchor_keys == null || 
              accumulator.allowed_anchor_keys.include(key)) {
            valid_key_value_anchor_pair_count++;
          
            // if the val is blank, we'll assume they want to remove that option
            if (val == "" || val == null) {
              accumulator.current_anchor_pairs.unset(key);
            } else {
              accumulator.current_anchor_pairs.set(key, val);
            }
          }
        });
    
        // if at this point we've got something we need to deal with, run the function
        if (anchor_pairs.length == key_value_anchor_pair_count && 
            key_value_anchor_pair_count == valid_key_value_anchor_pair_count) {
          var generated_query_string = accumulator.current_anchor_pairs.toQueryString();
        
          accumulator.current_anchor = "#" + generated_query_string; // save the anchor
        
          if (!accumulator.first_run) {
	          document.location = accumulator.current_anchor; // go to the new anchor
	          accumulator.accumulator_function(generated_query_string); // run the accumulator function
						if (e) {
							Event.stop(e);
						}
						if (accumulator.refresh_after_callback) {
							accumulator.observeAnchorLinks();
						}
					}
        }
      }      
    }
    accumulator.first_run = false;
  }
}