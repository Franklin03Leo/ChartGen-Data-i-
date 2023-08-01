import React from 'react'
import DemoVideo from '../../src/datai_demo.mp4'

const Demo = () => {

    return (
        <>
            <div className='row col-lg-12 demoVideo'>
                <iframe
                    id="video"
                    title="Demo"
                    //width="100%"
                    //heigh="100px"
                    // src={DemoVideo}
                    frameBorder="0"
                    allow="encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </>
    )
}
export default Demo