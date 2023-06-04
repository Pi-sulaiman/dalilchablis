import "./dcProjects.css";

import { dcComponent } from "../../dcComponent";
import { _UDom } from "../../../dcUtils/_UDom";
import { dcTranslator } from "../../../dcTranslator/dcTranslator";
import { dcTranslation } from "../../../dcTranslator/dcTranslation";
import { dcGlobalVars } from "../../../../global/dcGlobalVars";
import { dcCursor } from "../../dcCursor/dcCursor";

enum PROJECTS_CSS {
	CONTAINER = "projects-container",
	MENU_CONTAINER = "projects-menu-container",
	MENU_BUTTON = "projects-menu-button",
	MENU_BUTTON_ACTIVE = "projects-menu-button-active",
	TITLE = "projects-title",
	ITEMS = "projects-items",
	ITEM = "projects-item",
	ITEM_CONTENT = "projects-item-content",
	IMAGE = "projects-item-image",
	NAME = "projects-item-name",
	DESCRIPTION = "projects-item-description",
	TECH_STACK = "projects-item-stack",
	READ_MORE = "projects-item-read-more"
}

type dcProjectsType = {
	$title?: string,
	items: {
		imgPath: string,
		url: string,
		name: string,
		$description: string
		techStack: string
	}[]
}

export class dcProjects extends dcComponent {

	private data!: dcProjectsType[];

	private menuParent!: HTMLElement;
	private menuButtonByTitle: Map<string, HTMLElement> = new Map();

	private currentItemsTitle!: string;
	private itemsContainer!: HTMLElement;
	private itemsContainerByTitle: Map<string, HTMLElement> = new Map();

	constructor(parentElement: HTMLElement, autoInit: boolean = false) {
		super(parentElement, _UDom.CCE("projects", { className: PROJECTS_CSS.CONTAINER }));
		
		if (autoInit)
			this.init();
	}

	public setMenuParent(element: HTMLElement): void {
		this.menuParent = element;
	}
	
	public buildUI(): void {
		(async () => import("./dcProjects.json"))()
			.then((response: any) => {
				this.data = response.default;
				this.buildMenu();
			});
	}

	private buildMenu(): void {
		const container = _UDom.div({ className: PROJECTS_CSS.MENU_CONTAINER });

		for (let i = 0; i < this.data.length; i++) {
			const projects = this.data[i];
			if (projects?.$title) {
				const titleBtn = _UDom.h3({
					className: PROJECTS_CSS.TITLE,
					innerText: dcTranslator.T(dcTranslation[projects.$title])
				});

				dcCursor.subscribeElementToDetectHover(titleBtn);

				titleBtn.addEventListener("click", () => {
					this.menuButtonByTitle.get(this.currentItemsTitle)?.classList.remove(PROJECTS_CSS.MENU_BUTTON_ACTIVE);
					titleBtn.classList.add(PROJECTS_CSS.MENU_BUTTON_ACTIVE);
					this.buildItems(<string>projects.$title);
				});

				container.appendChild(titleBtn);

				if (i === 0) {
					this.buildItems(<string>projects.$title);
					titleBtn.classList.add(PROJECTS_CSS.MENU_BUTTON_ACTIVE);
				}

				this.menuButtonByTitle.set(projects.$title, titleBtn);
			}
		}

		if (this.menuParent) {
			this.menuParent.appendChild(container);
		} else {
			this.mainElement.appendChild(container);
		}
	}

	private buildItems(title: string): void {
		for (const projects of this.data) {
			if (title === projects?.$title) {
				if (this.currentItemsTitle === title) {
					return;
				}

				if (this.currentItemsTitle && this.itemsContainer === this.itemsContainerByTitle.get(this.currentItemsTitle)) {
					this.mainElement.removeChild(this.itemsContainer);
				}

				const existedContainer = this.itemsContainerByTitle.get(title);
				if (existedContainer) {
					this.currentItemsTitle = title;
					this.itemsContainer = existedContainer;
					this.moveParentScrollToTop();
					this.mainElement.appendChild(this.itemsContainer);
					return;
				}

				this.itemsContainer = _UDom.div({ className: PROJECTS_CSS.ITEMS });
				this.moveParentScrollToTop();

				for (const item of projects.items) {
					const div = _UDom.div({ className: PROJECTS_CSS.ITEM });
					const divContent = _UDom.div({ className: PROJECTS_CSS.ITEM_CONTENT });

					_UDom.AC(divContent, _UDom.img({
						src: dcGlobalVars.IMAGE_PATH + "projects/" + item.imgPath,
						className: PROJECTS_CSS.IMAGE
					}));
					_UDom.AC(divContent, _UDom.h5({ innerText: item.name, className: PROJECTS_CSS.NAME }));
					_UDom.AC(divContent, _UDom.p({
						innerText: dcTranslator.T(dcTranslation[item.$description]) + '.',
						className: PROJECTS_CSS.DESCRIPTION
					}));

					if (item.techStack) {
						divContent.appendChild(_UDom.p({
							innerText: item.techStack + '.',
							className: PROJECTS_CSS.TECH_STACK
						}));
					}

					if (item.url) {
						const readMore = _UDom.a({
							href: item.url,
							target: "_blank",
							innerText: dcTranslator.T(dcTranslation.READ_MORE) + "..."
						});
						dcCursor.subscribeElementToDetectHover(readMore);

						_UDom.AC(divContent, _UDom.AC(_UDom.p({ className: PROJECTS_CSS.READ_MORE }), readMore));
					}

					div.appendChild(divContent);

					this.itemsContainer.appendChild(div);
				}

				this.mainElement.appendChild(this.itemsContainer);
			}
		}
	}

	private moveParentScrollToTop(): void {
		if (this.menuParent) {
			this.menuParent.parentElement?.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		}
	}
	
}