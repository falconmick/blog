import React from "react"
import PropTypes from "prop-types"


const Video = ({ videoSrcURL, videoTitle }) => (
    <div className="video">
        {/*<iframe*/}
        {/*    src={videoSrcURL + "?enablejsapi=1&origin=http://localhost:8000&showinfo=0&iv_load_policy=3&modestbranding=1&theme=light&color=white&rel=0"}*/}
        {/*    title={videoTitle}*/}
        {/*    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"*/}
        {/*    frameBorder="0"*/}
        {/*    webkitallowfullscreen="true"*/}
        {/*    mozallowfullscreen="true"*/}
        {/*    allowFullScreen*/}
        {/*/>*/}
        <iframe
            src={videoSrcURL}
            title={videoTitle} frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ aspectRatio: "16/9", width: "100%" }}
        ></iframe>
    </div>
)

Video.propTypes = {
    videoSrcURL: PropTypes.string.isRequired,
    videoTitle: PropTypes.string.isRequired,
}

export default Video
