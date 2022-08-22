import React, {useState, useCallback, useRef, useEffect} from 'react';
import InnerLayout from '@/components/layouts/InnerLayout';
import { useFadeEffect, slsFetch } from '@/components/Util'; 
import CacheContext from '@/components/contexts/CacheContext';
import { getSessionCache } from '@/lib/Session';
import SurveyMessage from "@/components/surveyform/SurveyMessage";

const SnackbarType = {
  success: "success", 
  fail: "fail"
};

export default function SurveyForm({cache}){
    
    const[answer, setAnswer] = useState({});
    const[surveyQuestions, setQuestionsLabel] = useState([]);
    const[surveyOptions, setOptionsLabel] = useState([]);
    const [disable, setDisable] = useState(false);
    const [radio, setRadio] = useState(false);
    
    const snackbarRef = useRef(null)
    //function for inserting data to dat abase when submit button is clicked
    const onSubmit = useCallback((evt) => {
  
      snackbarRef.current.show()
      setDisable(true);
      setRadio(true);
        evt.preventDefault();
        (async () => {
            try {
              const response = await slsFetch('/api/app/surveyform/insert', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify({answer})
              })
            } catch(ex) {
              alert(ex);  
            } 
        })();
      }, [answer]);
      const getResponse= (e) =>{
        setAnswer(e.target.value);
        console.log(setAnswer);
          }
    // function for fetching Data
    const fetchData = async () => {
            try {
              const res_questions = await slsFetch('/api/app/surveyform/display_questions');  
              const res_options = await slsFetch('/api/app/surveyform/display_options'); 

              const data_questions = await res_questions.json();
              const data_options = await res_options.json();

              setQuestionsLabel(data_questions);
              setOptionsLabel(data_options);

              } catch (ex) {
                alert(ex)
              } 
          };

    
    useEffect(()=> {
        fetchData();
        },[]);
  
    return(
      <CacheContext.Provider value={cache}>
        <InnerLayout>
        <>      
        <div className='survey-container'>
            <form  id = "survey-form">
          
                <div className='survey-form-group'>
                
                  <fieldset>
                    {surveyQuestions.map((survey_question, id) => (
                      <div key={id}>
                      <label className='presidential-question'>{survey_question.questions}</label>
  
                      {surveyOptions.map((survey_option, i) => (
                        <div  key={i}>

                          <label className = "presidential-option-label ">
                          
                            <input type = "radio"
                            id = {i + survey_question.questions}
                            name={survey_question.questions}
                            value = {survey_option.options_value}
                            onChange={getResponse}
                            disabled = {radio}
                            />
                            <div className = "radio-images">
                            <img src={survey_option.options_image}/>
                            <p>{survey_option.options_value}</p>
                            </div>
                          </label>
                         
                        </div>
                      ))}
                      </div>
                    ))}
                  </fieldset>
                </div>
          </form>
          <div className='survey-form-group'>
                <button disabled={disable} className='submit-btn' onClick={onSubmit}  >
                Submit</button> 
            </div>
            <SurveyMessage  
            ref = {snackbarRef}
            message = "Thank you for participating! Your answer has been submitted."
          type = {SnackbarType.success}/>
         
        </div>
        </>
        </InnerLayout>
        </CacheContext.Provider>
    )
}

export const getServerSideProps = getSessionCache();