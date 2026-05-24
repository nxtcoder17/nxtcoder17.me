import { Show } from "solid-js";

interface ImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
  rounded?: boolean;
  border?: boolean;
  center?: boolean;
}

export default function Image(props: ImageProps) {
  const style = () => {
    const s: Record<string, string> = {};
    if (props.width) s.width = typeof props.width === "number" ? `${props.width}px` : props.width;
    if (props.height) s.height = typeof props.height === "number" ? `${props.height}px` : props.height;
    return s;
  };

  return (
    <figure class={`my-6 ${props.center !== false ? "flex flex-col items-center" : ""}`}>
      <img
        src={props.src}
        alt={props.alt || props.caption || ""}
        style={style()}
        class={`max-w-full h-auto ${props.rounded !== false ? "rounded-lg" : ""} ${props.border !== false ? "border border-border" : ""}`}
      />
      <Show when={props.caption}>
        <figcaption class="mt-2 text-sm text-muted text-center">
          {props.caption}
        </figcaption>
      </Show>
    </figure>
  );
}
