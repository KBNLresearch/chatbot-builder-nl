import React from "react";
import TextAnswer from "./answers/text";
import ButtonAnswer from "./answers/buttons";
import UrlAnswer from "./answers/url";
import ImageAnswer from "./answers/image";
import TypingAnswer from "./answers/typing";

const answerMap = {
    text: (props) => <TextAnswer {...props} />,
    buttons: (props) => <ButtonAnswer {...props} />,
    url: (props) => <UrlAnswer {...props} />,
    image: (props) => <ImageAnswer {...props} />,
    typing: (props) => <TypingAnswer {...props} />
};

class AnswerList extends React.Component {
    render() {
        const { answers } = this.props;
        return (
            <div>
                {answers.map((answer, i) => answerMap[answer.responseType]({...answer, key: i}))}
            </div>
        );
    }
}

export default AnswerList;