import React from "react";
import AnswerWrapper from "./wrapper";

class CarouselAnswer extends React.Component {

    render() {
        const {images, responseDelay} = this.props;
        return (
            <div>
                <i>(na {responseDelay} milliseconden)</i>
                <div style={{width: "100%", overflowX: "auto"}}>
                    <div style={{width: "8000px"}}>
                        {images.map(({image_url: imgSrc, title, url}, i) => (
                            <a target="_blank" href={url} key={i} style={{display: "block", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", float: "left", marginLeft: "10px", maxWidth: "300px", maxHeight: "328px"}}>
                                <img src={imgSrc} style={{maxWidth: "100%", maxHeight: "300px"}} /><br />
                                {title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default CarouselAnswer;