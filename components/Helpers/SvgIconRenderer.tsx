import React from 'react';


interface Props {
    size?: number,
    path: string,
    style?: React.CSSProperties
}


const SvgIconRenderer: React.FC<Props> = (props) => {
    // const {} = useActions()
    // const {} = useAppState()
    const { size = 24, path, style } = props;

    return <svg style={{ width: size, height: size, ...style }} viewBox="0 0 24 24">
        <path fill={style?.color ?? "#FFF"}
            d={path} />
    </svg>
};

export default SvgIconRenderer;
