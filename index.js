/*** DimmBySwitch *******************************************

-----------------------------------------------------------------------------
Author: Ralf Ebert
Description: Use a switch to dimm a device
******************************************************************************/

function DimmBySwitch (id, controller) {
    // Call superconstructor first (AutomationModule)
	DimmBySwitch.super_.call(this, id, controller);
}

inherits(DimmBySwitch, AutomationModule);

_module = DimmBySwitch;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

DimmBySwitch.prototype.init = function (config) {
	DimmBySwitch.super_.prototype.init.call(this, config);
    var self = this,
        sourceDevice = self.config.sourceDevice[self.config.sourceDevice.selDev],
        magnitude = self.config.magnitude.magnitudeValue,
    	status = sourceDevice.status,
    	targetDevice = self.config.dimmer[self.config.dimmer.selDim],
    	sceneLevel = sourceDevice.level;
    self.eventHandler = function(sDev){
    	var value = sDev.get("metrics:level");
        if(value === status || value === sceneLevel){
        	self.config.dimmer.forEach(function(dim) {
        		var dimmerType = dim.selDim,
        			id = dim[dimmerType].target,
        			vDev = self.controller.devices.get(id),
        			level = vDev.get("metrics:level"),
        			newLevel = level + magnitude;
        		vDev.performCommand("exact", { level: newLevel });
        	/**	self.controller.addNotification(
    					"error",
    					sceneLe,
    					"module",
    					"DimmBySwitch"
    			);*/
        	});
        }
    }
    self.controller.devices.on(sourceDevice.device, "change:metrics:level", self.eventHandler);
};
DimmBySwitch.prototype.stop = function () {
    DimmBySwitch.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------