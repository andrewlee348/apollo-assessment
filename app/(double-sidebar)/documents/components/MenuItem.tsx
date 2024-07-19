import "./MenuItem.scss";

import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

export default function MenuItem({
  svg,
  title,
  action,
  isActive = null,
}: {
  svg?: string;
  title?: string;
  action?: () => void;
  isActive?: (() => boolean) | null;
}) {
  return (
    <button
      className={`menu-item${isActive && isActive() ? " is-active" : ""}`}
      onClick={action}
      title={title}
    >
      <svg className="remix">
        <path d={svg}></path>
      </svg>
    </button>
  );
}
