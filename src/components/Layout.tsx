'use client';

import React, { useEffect } from 'react';
import { Layout, Row, Column, Dropdown } from 'finallyreact';
import { usePathname } from 'next/navigation';
import { Trans, useTranslation } from 'react-i18next';
import { useWindowSize } from 'finallyreact';

interface LayoutProps {
  children: React.ReactNode;
}

export default function (props: LayoutProps) {
  const { t, i18n } = useTranslation('layout');
  const pathname = usePathname();

  useEffect(() => {
    const lang = pathname.split('/')[1];

    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [pathname]);

  const { isMobile } = useWindowSize();

  return (
    <Layout
      showNavbar={true}
      fullHeight={true}
      navbarProps={{
        sticky: true,
        className: '"h-3 cloud-1-bg border-b-1 border-b-stone-9 w-full',
        centerContent: (
          <Row verticalAlign="center" className="navbar-row justify-content-between align-items-center">
            <div className="logo-container" tabIndex={0}>
              <h1 className="text-xl inline-block">
                <span className="sky-7 ml-1">image-training-set</span>
              </h1>
            </div>
          </Row>
        ),
        rightContent: (
          <div className="flex">
            <Dropdown
              id="layout-language"
              options={[
                {
                  value: 'en',
                  label: 'English'
                },
                {
                  value: 'ja',
                  label: '日本語'
                },
                {
                  value: 'es',
                  label: 'Español'
                },
                {
                  value: 'ko',
                  label: '한국어'
                },
                {
                  value: 'zh',
                  label: '简体中文'
                }
              ]}
              select={true}
              size="sm"
              className="mr-1/2"
              optionContainerProps={{
                className: 'w-fit'
              }}
              value={i18n.language}
              onChange={(e: any) => {
                const newLang = e.target.value;
                let newPathname = location.pathname.replace(`/${i18n.language}/`, `/${newLang}/`);

                if (location.pathname === `/${i18n.language}`) {
                  newPathname = newPathname.replace(`/${i18n.language}`, `/${newLang}`);
                }

                window.history.pushState(null, null, newPathname);

                i18n.changeLanguage(newLang);
              }}
            />
          </div>
        )
      }}
      showSidenav={false}
      contentProps={{
        className: 'ocean-9-bg'
      }}
    >
      <div>{props.children}</div>
    </Layout>
  );
}
