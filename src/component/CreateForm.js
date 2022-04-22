import './CreateEventForm.css'
import {useCallback, useState,useRef} from "react";
import usePlacesAutocomplete,{
    getGeocode,
    getLatLng
} from "use-places-autocomplete";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from "@reach/combobox";

import "@reach/combobox/styles.css"




const CreateForm = (prop) => {

    const [theLocation, setTheLocation] = useState('');
    const [theLat, setTheLat] = useState('');
    const [theLng, setTheLng] = useState('');
    const [theDescription, setTheDescription] = useState('');


    // State that holds an error or success message. Defaults to emttpy string
    const [message, setMessage] = useState('');

    // State that holds the current submission status. Defaults to emttpy string
    const [state, setState] = useState('');

    const submitHandler = (e) => {
        // We must prevent default! By default a form submission will reload the
        // page. With react, we skip the reload and do everything dynamically.
        e.preventDefault();

        // If any form input values are not populated, prevent submission and
        // display an error.
        if (!theLat || !theDescription) {
            // This adds the error message.
            setMessage('No empty values allowed');

            // The status state is used to add a class to the message, which styles
            // red for error, green for success.
            setState('error')
        } else {
            // We set a message on success.
            setMessage(`You added the location ${theLocation}!`);
            // Use setTimeout to set the message to blank after 4 seconds.
            // The message is helpful, but doesn't need to stick around
            // after it is seen.
            setTimeout(() => {
                setMessage('');
            }, 4000);

            // Set the status to success.
            setState('success')

            // This is the `setUmichEvents` function created in App.js
            // and passed here as a prop. This means this child component
            // can update the umichEvents state created in App.js
            prop.setPoint((current) => {
                // 👆When you execute a setState functiion like setUmichEvents.
                // the first argument can be another function with one arg:
                // the state's prior value.

                return [
                    {   
                        lat:theLat,
                        lng:theLng,
                        location: theLocation,
                        description: theDescription,
                        time: new Date(),
                    },
                    ...current,
                ];
            });
            // The above 👆 is essentially
            // return a new array [
            //    {the first item is the new event}
            //    then the ... spread operator adds all the
            //    preexisting events.

            // Clear the values of all the form inputs by updating their
            // states to empty strings.
            
            setTheLocation('');
            setTheLat('');
            setTheLng('');
            setTheDescription('');

        }
    }

    const {ready,
        value, 
        suggestions: { status , data}, 
        setValue,
        clearSuggestions,
       } = usePlacesAutocomplete({
       requestOptions:{
           location:{lat: ()=>37.7749, lng:()=> -122.4194},
           radius: 200000
       },
    })

    return (
        
        <div className='create-new-event'>
            <h1>Intern House 🏠</h1>
            <h2>Add New Location</h2>
            {/* display a success/error message when present */}
            <div className={'message ' + state}>{message}</div>
            {/* onSubmit is the event that is triggered when the form is submitted.
               We have a dedicated handler for that so React takes care of
               submissions, not the browser.
             */}
            <form onSubmit={submitHandler}>
                <div className='search'>
                    <Combobox onSelect={async(address)=>{
                        setValue(address,false);
                        clearSuggestions();

                        try {
                            const results = await getGeocode({address});
                            const {lat, lng} = await getLatLng(results[0])
                            setTheLat(lat)
                            setTheLng(lng)
                            setTheLocation(address)
                            prop.panTo({lat,lng})
                        } catch(error){
                            console.log("error")
                        };
                    }}>
                        <ComboboxInput value = {value} onChange={(e)=>{
                            setValue(e.target.value);
                        }}
                        disabled = {!ready}
                        placeholder = "Enter the Location"
                        />
                        <ComboboxPopover className="shadow-popup">
                            <ComboboxList>
                            {status === "OK" && 
                            data.map(({id,description})=>
                            (
                                <ComboboxOption key = {id} value = {description} />
                            ))}
                            </ComboboxList>
                        </ComboboxPopover>

                    </Combobox>


                </div>

                <div>
                    <label>
                        <div>Description</div>
                    </label>
                    <textarea
                        onChange={(e) => setTheDescription(e.target.value)}
                        value={theDescription}
                    >
                    </textarea>

                </div>
                
                <div>
                    <button type='submit'>Add Location</button>
                </div>
            </form>
        </div>
    );
}

// As always, we must export so others can import!
export default CreateForm;





