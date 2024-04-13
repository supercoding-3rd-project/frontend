import React from "react";
import "./editorComponent.scss";
import { Editor, EditorProps } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const EditorComponent = React.forwardRef<Editor, EditorProps>((props, ref) => {
  return (
    <Editor
      initialValue="나누고 싶은 생각을 적어주세요. 작성 완료 버튼 클릭 후에는 수정할 수 없어요."
      previewStyle="tab"
      height="600px"
      initialEditType="markdown"
      hideModeSwitch={true}
      useCommandShortcut={false}
      {...props}
      ref={ref}
    />
  );
});

export default EditorComponent;
