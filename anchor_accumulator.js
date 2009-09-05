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
  initialize : function(element, accumulator_function, allowed_anchor_keys) {
    this.element = $(element);
    this.accumulator_function = accumulator_function;
    this.allowed_anchor_keys = allowed_anchor_keys;
    
    this.current_anchor = "#";
    this.current_anchor_pairs = new Hash();
    this.first_run = true;
    
    anchor_accumulator = this;
    
    setInterval(this.checkAnchor, 200);
  },
  
  checkAnchor : function() {
    var accumulator = anchor_accumulator;
    
    // if the hash has data in it and has new changes
    if (document.location.hash != "" && document.location.hash != "#" && 
        accumulator.current_anchor != document.location.hash) {
      var hash_without_hash = document.location.hash.split("#")[1];
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
          accumulator.accumulator_function(accumulator.current_anchor_pairs);
        }
        
        accumulator.first_run = false;
      }
    }    
  }
}