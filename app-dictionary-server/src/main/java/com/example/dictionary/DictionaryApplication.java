package com.example.dictionary;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DictionaryApplication {

    public static void main(String[] args) {
        // On Windows, antivirus or a corporate proxy often re-signs HTTPS traffic with a root certificate that
        // only the Windows store knows, so Java's own store rejects every outgoing call (word auto-fill included).
        if (System.getProperty("os.name", "").startsWith("Windows")
                && System.getProperty("javax.net.ssl.trustStoreType") == null
                && System.getProperty("javax.net.ssl.trustStore") == null) {
            System.setProperty("javax.net.ssl.trustStoreType", "Windows-ROOT");
        }
        SpringApplication.run(DictionaryApplication.class, args);
    }

}
