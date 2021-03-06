import React from "react";
import TextAnswer from "./answers/text";
import ButtonAnswer from "./answers/buttons";
import UrlAnswer from "./answers/url";
import ImageAnswer from "./answers/image";
import WebhookAnswer from "./answers/webhook";
import TypingAnswer from "./answers/typing";

const answerMap = {
    text: (props) => <TextAnswer {...props} />,
    buttons: (props) => <ButtonAnswer {...props} />,
    url: (props) => <UrlAnswer {...props} />,
    image: (props) => <ImageAnswer {...props} />,
    typing: (props) => <TypingAnswer {...props} />,
    webhook: (props) => <WebhookAnswer {...props} />
};

class AnswerList extends React.Component {
    render() {
        const { answers, onSelectButton, selectedButton, onSwapUp, onSwapDown, onRemoveAnswer,
            onUpdateAnswer } = this.props;
        return (
            <div>
                {answers.map((answer, i) => answerMap[answer.responseType]({
                    ...answer, key: i,
                    onSelectButton: onSelectButton,
                    selectedButton: selectedButton,
                    onSwapUp: () => onSwapUp(answer.id),
                    onSwapDown: () => onSwapDown(answer.id),
                    onRemove: () => onRemoveAnswer(answer.id),
                    onChange: (data) => onUpdateAnswer(answer.id, data)
                }))}
            </div>
        );
    }
}

export default AnswerList;