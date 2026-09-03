import React from 'react';
import { useState } from 'react';



export default function App() {

    const [isShown, setIsShown] = useState(false);

    function handleDelete(){
        setIsShown(true)
    }

    function handleProceed(){
        setIsShown(false)
    }

    return (
      <div>
        { isShown ? <div data-testid="alert" id="alert">
                            <h2>Are you sure?</h2>
                            <p>These changes can't be reverted!</p>
                            <button onClick={handleProceed}>Proceed</button>
                        </div> : null}
        <button onClick={handleDelete}>Delete</button>
      </div>    
    );
}