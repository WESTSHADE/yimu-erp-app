import setRootPixel from "@arco-design/mobile-react/tools/flexible";

let isEnabled = false;

export const enableFlexible = () => {
    if (!isEnabled) {
        setRootPixel(37.5);
        isEnabled = true;
    }
};

export const disableFlexible = () => {
    if (isEnabled) {
        // 重置根字体大小到默认值
        document.documentElement.style.fontSize = "16px";
        isEnabled = false;
    }
};

export const setFlexible = (enabled: boolean) => {
    if (enabled) {
        enableFlexible();
    } else {
        disableFlexible();
    }
};
