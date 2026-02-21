"use client"
import Image from 'next/image';
import styles from './download.module.css';

export default function DownloadPage() {
  const handleDownload = () => {
    window.open('https://drive.google.com/file/d/14nG7HD9WMaHgVAkELWR9CaoA_p-OfvXt/view?usp=sharing', '_blank');
  };

  const handleSecondaryDownload = () => {
    window.open('https://drive.google.com/file/d/1_vVE2kJ0t7tkyfq6RB7dBOc70QsoNEsf/view?usp=sharing', '_blank');
  };

  const handleDriverDownload = (driver: string) => {
    const driverUrls: { [key: string]: string } = {
      'dx9': 'https://www.microsoft.com/en-us/download/details.aspx?id=35',
      'vc++': 'https://aka.ms/vs/17/release/vc_redist.x64.exe',
      'dx11': 'https://www.microsoft.com/en-us/download/details.aspx?id=17431',
      'vc++2015': 'https://www.microsoft.com/en-us/download/details.aspx?id=48145',
      'directx-runtime': 'https://www.microsoft.com/en-us/download/details.aspx?id=35'
    };
    window.open(driverUrls[driver], '_blank');
  };

  return (
    <div className={styles.downloadSection}>
      {/* Download Bar */}
      <div className={styles.downloadBar}>
        <Image
          src="/images/titles/Download.png"
          alt="Download"
          width={333}
          height={73}
          className={styles.downloadTitle}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={991}
            height={8}
            className={styles.barImage}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Left Side - Installer and Drivers */}
          <div className={styles.leftSide}>
            {/* Installer Section */}
            <div className={styles.installerSection}>
              <h2 className={styles.sectionTitle}>INSTALLER</h2>
              <div className={styles.downloadButtons}>
                <button 
                  className={styles.downloadBtn}
                  onClick={handleDownload}
                >
                  <Image 
                    src="/images/icons/Drive.png" 
                    alt="Google Drive" 
                    width={24} 
                    height={24}
                  />
                  Google Drive
                </button>
                <button 
                  className={styles.downloadBtn}
                  onClick={handleSecondaryDownload}
                >
                  <Image 
                    src="/images/icons/Drive.png" 
                    alt="Google Drive" 
                    width={24} 
                    height={24}
                  />
                  Google Drive (2nd link)
                </button>
              </div>
            </div>

            {/* Required Drivers Section */}
            <div className={styles.driversSection}>
              <h2 className={styles.sectionTitle}>REQUIRED DRIVERS</h2>
              <div className={styles.driverButtons}>
                <button 
                  className={styles.driverBtn}
                  onClick={() => handleDriverDownload('dx9')}
                >
                  DirectX 9.0c
                </button>
                <button 
                  className={styles.driverBtn}
                  onClick={() => handleDriverDownload('vc++')}
                >
                  Visual C++ Redistributable
                </button>
                <button 
                  className={styles.driverBtn}
                  onClick={() => handleDriverDownload('dx11')}
                >
                  DirectX 11
                </button>
              </div>
              <div className={`${styles.driverButtons} ${styles.driverButtonsSecondary}`}>
                <button 
                  className={styles.driverBtn}
                  onClick={() => handleDriverDownload('vc++2015')}
                >
                  Visual C++ 2015
                </button>
                <button 
                  className={styles.driverBtn}
                  onClick={() => handleDriverDownload('directx-runtime')}
                >
                  DirectX Runtime
                </button>
              </div>
              <p className={styles.driverNote}>
                Install these drivers if the game fails to launch or crashes on startup.
              </p>
            </div>
          </div>

          {/* Right Side - System Requirements */}
          <div className={styles.rightSide}>
            <div className={styles.requirementsSection}>
              <h2 className={styles.sectionTitle}>SYSTEM REQUIREMENTS</h2>
              
              <div className={styles.requirementsGrid}>
                <div className={styles.minimumRequirements}>
                  <h3 className={styles.requirementsTitle}>MINIMUM:</h3>
                  <div className={styles.requirementsList}>
                    <div className={styles.requirementItem}>
                      <span className={styles.requirementLabel}>OS:</span>
                      <span className={styles.requirementValue}>Windows 7</span>
                    </div>
                    <div className={styles.requirementItem}>
                      <span className={styles.requirementLabel}>Processor:</span>
                      <span className={styles.requirementValue}>Pentium4 1.6GHz</span>
                    </div>
                    <div className={styles.requirementItem}>
                      <span className={styles.requirementLabel}>RAM:</span>
                      <span className={styles.requirementValue}>2GB RAM</span>
                    </div>
                    <div className={styles.requirementItem}>
                      <span className={styles.requirementLabel}>Graphics:</span>
                      <span className={styles.requirementValue}>GeForce FX5700 128Mb</span>
                    </div>
                    <div className={styles.requirementItem}>
                      <span className={styles.requirementLabel}>DirectX:</span>
                      <span className={styles.requirementValue}>Version 9.0c</span>
                    </div>
                    <div className={styles.requirementItem}>
                      <span className={styles.requirementLabel}>Storage:</span>
                      <span className={styles.requirementValue}>2 GB available space</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
