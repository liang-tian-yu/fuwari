import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";
import { h } from '@expressive-code/core/hast';

/**
 * !!! Notice: You should remove .astro/ cache folder and restart to see the changes
 */

export function pluginLanguageBadge() {
    return definePlugin({
        name: "Custom Badge",
        hooks: {
            postprocessRenderedBlock: ({ codeBlock, renderData, locale }) => {
                const { props, language } = codeBlock;
                let shouldAddBadge = false;
                function traverse(node: Element) {
                    if (node.type === 'element' && node.tagName === 'figure') {
                        const className = Array.isArray(node.properties.className) ? node.properties.className : [node.properties.className];
                        shouldAddBadge = !className.some(cn => cn === 'has-title' || cn === 'is-terminal');
                    }
                    if (node.type === 'element' && node.tagName === 'pre') {
                        processCodeBlock(node, shouldAddBadge);
                        return;
                    }
                    if (node.children) {
                        for (const child of node.children) {
                            if (child.type === "element") traverse(child);
                        }
                    }
                }
                function processCodeBlock(node: Element, shouldAddBadge: boolean) {
                    if (shouldAddBadge) {
                        if (!node.children) {
                            node.children = [];
                        }
                        node.children.push(h('div', { className: 'language-badge' }, language))
                    }
                }

                traverse(renderData.blockAst);
            }
        }
    })
}