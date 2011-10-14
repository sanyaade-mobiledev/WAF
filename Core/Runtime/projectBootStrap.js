/*
* Copyright (c) 4D, 2011
*
* This file is part of Wakanda Application Framework (WAF).
* Wakanda is an open source platform for building business web applications
* with nothing but JavaScript.
*
* Wakanda Application Framework is free software. You can redistribute it and/or
* modify since you respect the terms of the GNU General Public License Version 3,
* as published by the Free Software Foundation.
*
* Wakanda is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* Licenses for more details.
*
* You should have received a copy of the GNU General Public License version 3
* along with Wakanda. If not see : http://www.gnu.org/licenses/
*/
/*
* Register the services according to the services settings
*/

var servicesSettings = settings.getItem( 'services');
if ((servicesSettings != null) && (typeof servicesSettings != 'undefined')) {

	var servicesModule = require( 'services');
	if ((servicesModule != null) && (typeof servicesModule != 'undefined')) {
	
		for (var serviceName in servicesSettings) {
			servicesModule.registerService( serviceName);
		}
	}
}
