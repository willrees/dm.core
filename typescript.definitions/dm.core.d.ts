interface JQueryGenericPromise<T> {
    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then<U>(doneFilter: (value?: T, ...values: any[]) => U|JQueryPromise<U>, failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any): JQueryPromise<U>;

    /**
     * Add handlers to be called when the Deferred object is resolved, rejected, or still in progress.
     * 
     * @param doneFilter A function that is called when the Deferred is resolved.
     * @param failFilter An optional function that is called when the Deferred is rejected.
     */
    then(doneFilter: (value?: T, ...values: any[]) => void, failFilter?: (...reasons: any[]) => any, progressFilter?: (...progression: any[]) => any): JQueryPromise<void>;
}

interface JQueryPromiseCallback<T> {
    (value?: T, ...args: any[]): void;
}

interface JQueryPromise<T> extends JQueryGenericPromise<T> {
    /**
     * Determine the current state of a Deferred object.
     */
    state(): string;
    /**
     * Add handlers to be called when the Deferred object is either resolved or rejected.
     * 
     * @param alwaysCallbacks1 A function, or array of functions, that is called when the Deferred is resolved or rejected.
     * @param alwaysCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved or rejected.
     */
    always(alwaysCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...alwaysCallbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<T>;
    /**
     * Add handlers to be called when the Deferred object is resolved.
     * 
     * @param doneCallbacks1 A function, or array of functions, that are called when the Deferred is resolved.
     * @param doneCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is resolved.
     */
    done(doneCallback1?: JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[], ...doneCallbackN: Array<JQueryPromiseCallback<T>|JQueryPromiseCallback<T>[]>): JQueryPromise<T>;
    /**
     * Add handlers to be called when the Deferred object is rejected.
     * 
     * @param failCallbacks1 A function, or array of functions, that are called when the Deferred is rejected.
     * @param failCallbacks2 Optional additional functions, or arrays of functions, that are called when the Deferred is rejected.
     */
    fail(failCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...failCallbacksN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<T>;
    /**
     * Add handlers to be called when the Deferred object generates progress notifications.
     * 
     * @param progressCallbacks A function, or array of functions, to be called when the Deferred generates progress notifications.
     */
    progress(progressCallback1?: JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[], ...progressCallbackN: Array<JQueryPromiseCallback<any>|JQueryPromiseCallback<any>[]>): JQueryPromise<T>;

    // Deprecated - given no typings
    pipe(doneFilter?: (x: any) => any, failFilter?: (x: any) => any, progressFilter?: (x: any) => any): JQueryPromise<any>;
}

//dm.configuration
interface DMConfigurationErrors {
     redirectOnErrors: boolean;
     defaultErrorPage: string;
}
interface DMConfigurationAuthentication {
     usesAuthentication: boolean;
     loginPage: string;
}
interface DMConfiguration {
     basePath: string;
     errors: DMConfigurationErrors;
     authentication: DMConfigurationAuthentication;   
}

//new dm.List
interface List_Static {
     /**
      * Creates an extended array which has various helper methods. The base object is still array.
      *
      * @param array (optional) array used to create the extended type. 
      * @return TypesList
      */
	new (array?: any[]) : List_Instance;	
}
interface List_Instance {
    /**
      * Gets the first item in the list.
      * 
      * @return any
      */
     first() : any[];
     /**
      * Gets the last item in the list.
      * 
      * @return any
      */
     last() : any[];
     /**
      * Searches the array for specific values and returns a new List_Instance.
      * 
      * @param test Function - The test that you are filtering against. This function recieves an item parameter and must return bool.
      * @return List_Instance
      */
     where(test: Function) : any[];
     /**
      * Creates a new List of a specific property. 
      * 
      * @param propertyName string - the name of the property on each item.
      * @return List_Instance
      */
     pluck(propertyName: string) : any[];
     /**
      * Shuffles the List.
      * 
      * @return List_Instance
      */
     shuffle() : any[];
}

//dm.http
interface Http {
    /**
      * Executes an async get request.
      * 
      * @param url string - The url for the requested resource.
      * @return JQueryPromise<any>
      */
	get(url: string): JQueryPromise<any>;
    /**
      * Executes an async post request.
      * 
      * @param url string - The url for the requested resource.
      * @param data any - Object containing the post data.
      * @return JQueryPromise<any>
      */
	post(url: string, data: any): JQueryPromise<any>;
    /**
      * Executes an async put request.
      * 
      * @param url string - The url for the requested resource.
      * @param data any - Object containing the post data.
      * @return JQueryPromise<any>
      */
	put(url: string, data: any): JQueryPromise<any>;
    /**
      * Executes an async delete request.
      * 
      * @param url string - The url for the requested resource.
      * @param data any - Object containing the post data.
      * @return JQueryPromise<any>
      */
	delete(url: string, data: any): JQueryPromise<any>;
	settings: any;
}

//dm.utilities
interface Utilities {
      date: UtilitiesDate; 
}


interface UtilitiesDate {
      /**
      * Checks a string to see if it is a valid date
      * 
      * @param txtDate string - The text representation of the date.      
      * @return Boolean
      */
      isDate(txtDate: string) : Boolean;
}

//dm
interface DMStatic {
     config: DMConfiguration;    
     List: List_Static; 
     http : Http;
     utilities: Utilities;
}

declare var dm: DMStatic;