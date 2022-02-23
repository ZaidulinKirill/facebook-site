/* eslint-disable react/no-danger */
/* eslint-disable no-undef */
import React from 'react';
import { Box, Grid } from '@mui/material';
import mapValuesDeep from 'map-values-deep';
import Head from 'react-helmet';
import { Components } from '../constants';
import { ThemeProvider } from '../constants/components/themeProvider';

const operators = {
  $eq: 'console.log(arguments); return [...arguments].every( x => x === arguments[0] )',
};

export class PageRenderer {
  constructor({ modules, primaryColor, fontId, faviconId, fonts, inline }) {
    const reducesInfo = modules.reduce((acc, { moduleId, moduleVariables, templateComponents, templateVariables }) => {
      const totalTemplateVariables = [];
      const totalModuleVariables = {};
      let totalTemplateComponents = templateComponents;

      templateVariables.forEach((variable) => {
        const newName = `${moduleId}_${variable.value}`;

        totalTemplateVariables.push({ ...variable, value: newName });
        totalModuleVariables[newName] = moduleVariables[variable.value];
        totalTemplateComponents = mapValuesDeep(totalTemplateComponents, (value, key) => {
          if (value === `{{${variable.value}}}`) {
            return `{{${newName}}}`;
          }

          if (key === 'ref' && value === variable.value) {
            return newName;
          }

          return value;
        });
      });

      return {
        ...acc,
        totalTemplateVariables: [...acc.totalTemplateVariables, ...totalTemplateVariables],
        totalModuleVariables: { ...acc.totalModuleVariables, ...totalModuleVariables },
        totalTemplateComponents: [...acc.totalTemplateComponents, ...totalTemplateComponents],
      };
    }, {
      totalTemplateVariables: [],
      totalModuleVariables: {},
      totalTemplateComponents: [],
    });

    this.primaryColor = primaryColor;
    this.fontId = fontId;
    this.fonts = fonts;
    this.modules = modules;
    this.inline = inline;

    this.templateComponents = reducesInfo.totalTemplateComponents;
    this.templateVariables = reducesInfo.totalTemplateVariables.reduce((acc, item) => { acc[item.value] = item; return acc; }, {
      Favicon: { value: 'Favicon', type: 'image' },
    });
    this.pageVariables = {
      ...reducesInfo.totalModuleVariables,
      Favicon: faviconId ? `${faviconId}` : '',
    };
  }

  render(children) {
    const fixedNavbar = this.modules.find((x) => x.systemType === 'fixed-navbar');
    const fixedNavbarHeight = fixedNavbar && fixedNavbar.templateComponents[0]?.content[0]?.style?.marginTop;

    const css = !this.inline && `
      ${this.fonts.map((font) => `@import url('${font.url}');`).join('\n')}

      html { 
        height: 100%;
        font-size: 18px;
      }

      html, body, body #root, body #root > .root-container, body #root > .root-container > .page-container {
        height: 100%;
      }

      body {
        background: rgb(236, 177, 189);
      }

      body #root { 
        font-family: '${this.fontId}'; 
      }

      .es-widget {
        overflow-x: hidden !important;
      }

      .lg-next {
        transform: scale(-1, 1);
      }

      .lg-next::after {
        content: "\\e094";
      }

      p.Mui-error {
        height: 0 !important;
        margin-bottom: -3px;
      }

      ${fixedNavbar && fixedNavbarHeight ? `
        body #root {
          scroll-padding-top: ${fixedNavbarHeight.xs};
        }

        [id]::before {
          content: '';
          display: block;
          height: ${fixedNavbarHeight.xs};
          margin-top: -${fixedNavbarHeight.xs};
          visibility: hidden;
        }

        @media (min-width: 900px) { 
          [id]::before {
            height: ${fixedNavbarHeight.md};
            margin-top: -${fixedNavbarHeight.md};
          }

          body #root {
            scroll-padding-top: ${fixedNavbarHeight.md};
          }
        }
      ` : ''}
    `;

    return this.inline && !children ? this.renderComponents(this.templateComponents) : (
      <>
        <Head>
          <style>
            {css}
          </style>
        </Head>
        <ThemeProvider primaryColor={this.primaryColor} secondaryColor="#ffc400" themeProps={{ typography: { fontFamily: this.fontId } }}>
          {children || this.renderComponents(this.templateComponents)}
        </ThemeProvider>
      </>
    );
  }

  insertVariables(props) {
    const preprocessValue = (templateVariable, pageVariable, variableKey) => {
      if (!templateVariable) {
        throw new Error(`Variable not found: ${variableKey}`);
      }

      if (templateVariable.type === 'image' && pageVariable) {
        if (templateVariable.wrapUrl) {
          return `url(/api/uploads/${templateVariable.size ? `${templateVariable.size}/` : ''}${pageVariable}${templateVariable.size ? '.png' : ''})`;
        }

        return `/api/uploads/${templateVariable.size ? `${templateVariable.size}/` : ''}${pageVariable}${templateVariable.size ? '.png' : ''}`;
      }

      return pageVariable;
    };

    return mapValuesDeep(props, (value, key) => {
      if (key === '$context' || key === '$if') {
        return value;
      }

      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const variableKey = value.replace('{{', '').replace('}}', '');
        const templateVariable = this.templateVariables[variableKey];
        const pageVariable = preprocessValue(templateVariable, this.pageVariables[variableKey], variableKey);

        if (!templateVariable) {
          throw new Error(`Unknown variable: ${variableKey}`);
        }

        return (pageVariable === undefined || pageVariable === null)
          ? null
          : pageVariable;
      }

      return value;
    });
  }

  renderComponents(children) {
    return children.map((child, idx) => {
      if (child.type === 'form-content') {
        const variableKey = child.ref;
        const templateVariable = this.templateVariables[variableKey];
        const pageVariable = this.pageVariables[variableKey];

        if (!templateVariable) {
          throw new Error(`Unknown variable: ${variableKey}`);
        }

        if (!pageVariable) {
          return null;
        }

        return (
          <React.Fragment key={idx}>
            {pageVariable.map(({ type, id, xs, sm, md, lg, xl, height, ...field }, fieldIdx) => {
              const { Component: FieldComponent } = Components[type];

              if (!FieldComponent) {
                throw new Error(`${type} not implemented`);
              }

              return (
                <Grid
                  item
                  xs={xs}
                  sm={sm}
                  md={md}
                  lg={lg}
                  xl={xl}
                  key={fieldIdx}
                >
                  <Box
                    height="100%"
                    display="flex"
                    alignItems="flex-start"
                    sx={{ height }}
                  >
                    {FieldComponent !== 'void' && <FieldComponent {...field} />}
                  </Box>
                </Grid>
              );
            })}
          </React.Fragment>
        );
      }

      if (child.type === 'array') {
        const variableKey = child.ref;
        const templateVariable = this.templateVariables[variableKey];
        const pageVariable = this.pageVariables[variableKey];

        if (!templateVariable) {
          throw new Error(`Unknown variable: ${variableKey}`);
        }

        if (!pageVariable) {
          return null;
        }

        const items = pageVariable.map((item) => mapValuesDeep(child.content[0], (value) => {
          if (typeof value === 'string' && value.startsWith('[[') && value.endsWith(']]')) {
            const clearedKey = value.replace('[[', '').replace(']]', '');
            const variable = templateVariable.variables.find((x) => x.value === clearedKey);

            if (!variable) {
              throw new Error(`Unknown variable: ${clearedKey}`);
            }

            if (variable.type === 'image') {
              return `/api/uploads/${variable.size ? `${variable.size}/` : ''}${item[clearedKey]}${variable.size ? '.png' : ''}`;
            }

            return item[clearedKey];
          }

          return value;
        }));

        return (
          <React.Fragment key={idx}>
            {this.renderComponents(items)}
          </React.Fragment>
        );
      }

      const { Component, context } = Components[child.type];

      if (!Component) {
        throw new Error(`${child.type} not implemented`);
      }

      const allProps = {
        ...child.props,
        ...child.style && { sx: child.style },
        key: idx,
        ...child.content && typeof child.content === 'string' && {
          children: child.content,
        },
        ...context && {
          $context: { element: child, templateVariables: this.templateVariables, pageVariables: this.pageVariables },
        },
        $if: child.$if,
      };

      const { $if, ...resultProps } = this.insertVariables(allProps);

      // eslint-disable-next-line no-new-func
      if ($if && !new Function(operators[$if.op]).call(null, ...$if.args)) {
        return null;
      }

      if (!child.content || typeof child.content === 'string') {
        return (
          <Component {...resultProps}>
            {resultProps.children}
          </Component>
        );
      }

      return (
        <Component {...resultProps}>
          {this.renderComponents(child.content)}
        </Component>
      );
    });
  }
}
